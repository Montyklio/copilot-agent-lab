import { useState, useCallback, useMemo, useEffect } from 'react';
import type { BingoSquareData, BingoLine, GameState } from '../types';
import {
  generateBoard,
  markSquare,
  unmarkSquare,
  updateSquareName,
  getMarkedConnections,
  checkBingo,
  getWinningSquareIds,
} from '../utils/bingoLogic';

export interface BingoGameState {
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
  winningSquareIds: Set<number>;
  showBingoModal: boolean;
  showNameCaptureModal: boolean;
  showConnectionsView: boolean;
  selectedSquareId: number | null;
  connections: BingoSquareData[];
}

export interface BingoGameActions {
  startGame: () => void;
  handleSquareClick: (squareId: number) => void;
  handleNameSave: (name: string) => void;
  handleNameSkip: () => void;
  handleUnmarkSquare: () => void;
  cancelNameCapture: () => void;
  resetGame: () => void;
  dismissModal: () => void;
  openConnectionsView: () => void;
  closeConnectionsView: () => void;
  editConnection: (squareId: number) => void;
}

const STORAGE_KEY = 'bingo-game-state';
const STORAGE_VERSION = 2;

interface StoredGameData {
  version: number;
  gameState: GameState;
  board: BingoSquareData[];
  winningLine: BingoLine | null;
}

function validateStoredData(data: unknown): data is StoredGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (obj.version !== STORAGE_VERSION) {
    return false;
  }
  
  if (typeof obj.gameState !== 'string' || !['start', 'playing', 'bingo'].includes(obj.gameState)) {
    return false;
  }
  
  if (!Array.isArray(obj.board) || (obj.board.length !== 0 && obj.board.length !== 25)) {
    return false;
  }
  
  const validSquares = obj.board.every((sq: unknown) => {
    if (!sq || typeof sq !== 'object') return false;
    const square = sq as Record<string, unknown>;
    return (
      typeof square.id === 'number' &&
      typeof square.text === 'string' &&
      typeof square.isMarked === 'boolean' &&
      typeof square.isFreeSpace === 'boolean' &&
      (square.personName === undefined || typeof square.personName === 'string') &&
      (square.timestamp === undefined || typeof square.timestamp === 'number')
    );
  });
  
  if (!validSquares) {
    return false;
  }
  
  if (obj.winningLine !== null) {
    if (typeof obj.winningLine !== 'object') {
      return false;
    }
    const line = obj.winningLine as Record<string, unknown>;
    if (
      typeof line.type !== 'string' ||
      !['row', 'column', 'diagonal'].includes(line.type) ||
      typeof line.index !== 'number' ||
      !Array.isArray(line.squares)
    ) {
      return false;
    }
  }
  
  return true;
}

function loadGameState(): Pick<BingoGameState, 'gameState' | 'board' | 'winningLine'> | null {
  // SSR guard
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
    }

    const parsed = JSON.parse(saved);
    
    if (validateStoredData(parsed)) {
      return {
        gameState: parsed.gameState,
        board: parsed.board,
        winningLine: parsed.winningLine,
      };
    } else {
      console.warn('Invalid game state data in localStorage, clearing...');
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return null;
}

function saveGameState(gameState: GameState, board: BingoSquareData[], winningLine: BingoLine | null): void {
  // SSR guard
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const data: StoredGameData = {
      version: STORAGE_VERSION,
      gameState,
      board,
      winningLine,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export function useBingoGame(): BingoGameState & BingoGameActions {
  const loadedState = useMemo(() => loadGameState(), []);

  const [gameState, setGameState] = useState<GameState>(
    () => loadedState?.gameState || 'start'
  );
  const [board, setBoard] = useState<BingoSquareData[]>(
    () => loadedState?.board || []
  );
  const [winningLine, setWinningLine] = useState<BingoLine | null>(
    () => loadedState?.winningLine || null
  );
  const [showBingoModal, setShowBingoModal] = useState(false);
  const [showNameCaptureModal, setShowNameCaptureModal] = useState(false);
  const [showConnectionsView, setShowConnectionsView] = useState(false);
  const [selectedSquareId, setSelectedSquareId] = useState<number | null>(null);

  const winningSquareIds = useMemo(
    () => getWinningSquareIds(winningLine),
    [winningLine]
  );

  const connections = useMemo(
    () => getMarkedConnections(board),
    [board]
  );

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState, board, winningLine);
  }, [gameState, board, winningLine]);

  const startGame = useCallback(() => {
    setBoard(generateBoard());
    setWinningLine(null);
    setGameState('playing');
  }, []);

  const handleSquareClick = useCallback((squareId: number) => {
    const square = board.find((s) => s.id === squareId);
    if (!square || square.isFreeSpace) return;

    setSelectedSquareId(squareId);
    setShowNameCaptureModal(true);
  }, [board]);

  const handleNameSave = useCallback((name: string) => {
    if (selectedSquareId === null) return;

    setBoard((currentBoard) => {
      const square = currentBoard.find((s) => s.id === selectedSquareId);
      if (!square) return currentBoard;

      let newBoard: BingoSquareData[];
      
      if (square.isMarked) {
        // Update existing name
        newBoard = updateSquareName(currentBoard, selectedSquareId, name);
      } else {
        // Mark with name
        newBoard = markSquare(currentBoard, selectedSquareId, name);
        
        // Check for bingo after marking
        const bingo = checkBingo(newBoard);
        if (bingo && !winningLine) {
          queueMicrotask(() => {
            setWinningLine(bingo);
            setGameState('bingo');
            setShowBingoModal(true);
          });
        }
      }
      
      return newBoard;
    });

    setShowNameCaptureModal(false);
    setSelectedSquareId(null);
  }, [selectedSquareId, winningLine]);

  const handleNameSkip = useCallback(() => {
    if (selectedSquareId === null) return;

    setBoard((currentBoard) => {
      const square = currentBoard.find((s) => s.id === selectedSquareId);
      if (!square || square.isMarked) return currentBoard;

      const newBoard = markSquare(currentBoard, selectedSquareId);
      
      // Check for bingo after marking
      const bingo = checkBingo(newBoard);
      if (bingo && !winningLine) {
        queueMicrotask(() => {
          setWinningLine(bingo);
          setGameState('bingo');
          setShowBingoModal(true);
        });
      }
      
      return newBoard;
    });

    setShowNameCaptureModal(false);
    setSelectedSquareId(null);
  }, [selectedSquareId, winningLine]);

  const handleUnmarkSquare = useCallback(() => {
    if (selectedSquareId === null) return;

    setBoard((currentBoard) => unmarkSquare(currentBoard, selectedSquareId));
    setShowNameCaptureModal(false);
    setSelectedSquareId(null);
  }, [selectedSquareId]);

  const cancelNameCapture = useCallback(() => {
    setShowNameCaptureModal(false);
    setSelectedSquareId(null);
  }, []);

  const resetGame = useCallback(() => {
    setGameState('start');
    setBoard([]);
    setWinningLine(null);
    setShowBingoModal(false);
    setShowNameCaptureModal(false);
    setShowConnectionsView(false);
    setSelectedSquareId(null);
  }, []);

  const dismissModal = useCallback(() => {
    setShowBingoModal(false);
  }, []);

  const openConnectionsView = useCallback(() => {
    setShowConnectionsView(true);
  }, []);

  const closeConnectionsView = useCallback(() => {
    setShowConnectionsView(false);
  }, []);

  const editConnection = useCallback((squareId: number) => {
    setSelectedSquareId(squareId);
    setShowConnectionsView(false);
    setShowNameCaptureModal(true);
  }, []);

  return {
    gameState,
    board,
    winningLine,
    winningSquareIds,
    showBingoModal,
    showNameCaptureModal,
    showConnectionsView,
    selectedSquareId,
    connections,
    startGame,
    handleSquareClick,
    handleNameSave,
    handleNameSkip,
    handleUnmarkSquare,
    cancelNameCapture,
    resetGame,
    dismissModal,
    openConnectionsView,
    closeConnectionsView,
    editConnection,
  };
}
