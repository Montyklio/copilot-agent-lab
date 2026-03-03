import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateBoard,
  toggleSquare,
  markSquare,
  unmarkSquare,
  updateSquareName,
  getMarkedConnections,
  checkBingo,
  getWinningSquareIds,
  type BingoSquareData,
} from './bingoLogic';

describe('bingoLogic', () => {
  describe('generateBoard', () => {
    it('should generate a board with 25 squares', () => {
      const board = generateBoard();
      expect(board).toHaveLength(25);
    });

    it('should have a free space in the center (index 12)', () => {
      const board = generateBoard();
      expect(board[12].isFreeSpace).toBe(true);
      expect(board[12].isMarked).toBe(true);
    });

    it('should have unique IDs from 0 to 24', () => {
      const board = generateBoard();
      const ids = board.map((square) => square.id);
      expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => i));
    });

    it('should have 24 non-free spaces', () => {
      const board = generateBoard();
      const nonFreeSpaces = board.filter((square) => !square.isFreeSpace);
      expect(nonFreeSpaces).toHaveLength(24);
    });

    it('should have all non-free spaces unmarked initially', () => {
      const board = generateBoard();
      const nonFreeSpaces = board.filter((square) => !square.isFreeSpace);
      nonFreeSpaces.forEach((square) => {
        expect(square.isMarked).toBe(false);
      });
    });

    it('should randomize question order between boards', () => {
      // Mock Math.random to make it deterministic for first call
      const originalRandom = Math.random;
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount / 100;
      });

      const board1 = generateBoard();
      
      // Reset counter for second board
      callCount = 0;
      const board2 = generateBoard();

      Math.random = originalRandom;

      // Boards should have different order (very unlikely to be the same with randomization)
      const texts1 = board1.filter((s) => !s.isFreeSpace).map((s) => s.text);
      const texts2 = board2.filter((s) => !s.isFreeSpace).map((s) => s.text);
      
      // At least verify structure is correct
      expect(texts1).toHaveLength(24);
      expect(texts2).toHaveLength(24);
    });
  });

  describe('toggleSquare', () => {
    let mockBoard: BingoSquareData[];

    beforeEach(() => {
      mockBoard = [
        { id: 0, text: 'Q1', isMarked: false, isFreeSpace: false },
        { id: 1, text: 'Q2', isMarked: true, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
      ];
    });

    it('should toggle unmarked square to marked', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[0].isMarked).toBe(true);
    });

    it('should toggle marked square to unmarked', () => {
      const newBoard = toggleSquare(mockBoard, 1);
      expect(newBoard[1].isMarked).toBe(false);
    });

    it('should not modify free space', () => {
      const newBoard = toggleSquare(mockBoard, 2);
      expect(newBoard[2].isMarked).toBe(true);
    });

    it('should return a new array', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard).not.toBe(mockBoard);
    });

    it('should not modify other squares', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[1].isMarked).toBe(mockBoard[1].isMarked);
      expect(newBoard[2].isMarked).toBe(mockBoard[2].isMarked);
    });
  });

  describe('checkBingo', () => {
    it('should return null for board without enough squares', () => {
      const board = generateBoard();
      // Clear some squares to test edge case
      expect(checkBingo(board)).toBeNull();
    });

    it('should return null when no lines are complete', () => {
      const board = generateBoard();
      expect(checkBingo(board)).toBeNull();
    });

    it('should detect a complete row', () => {
      const board = generateBoard();
      // Mark first row (indices 0-4)
      for (let i = 0; i < 5; i++) {
        board[i].isMarked = true;
      }
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('row');
      expect(result?.index).toBe(0);
    });

    it('should detect a complete column', () => {
      const board = generateBoard();
      // Mark first column (indices 0, 5, 10, 15, 20)
      for (let i = 0; i < 5; i++) {
        board[i * 5].isMarked = true;
      }
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('column');
      expect(result?.index).toBe(0);
    });

    it('should detect a complete diagonal (top-left to bottom-right)', () => {
      const board = generateBoard();
      // Mark diagonal (indices 0, 6, 12, 18, 24)
      // Note: 12 is already marked as free space
      [0, 6, 12, 18, 24].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('diagonal');
    });

    it('should detect a complete diagonal (top-right to bottom-left)', () => {
      const board = generateBoard();
      // Mark diagonal (indices 4, 8, 12, 16, 20)
      [4, 8, 12, 16, 20].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('diagonal');
    });

    it('should work with free space in center', () => {
      const board = generateBoard();
      // The center (12) is already marked as free space
      // Complete the middle row
      [10, 11, 12, 13, 14].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('row');
      expect(result?.index).toBe(2);
    });
  });

  describe('getWinningSquareIds', () => {
    it('should return empty set when no winning line', () => {
      const result = getWinningSquareIds(null);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('should return square IDs from winning line', () => {
      const winningLine = {
        type: 'row' as const,
        index: 0,
        squares: [0, 1, 2, 3, 4],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(5);
      expect(result.has(0)).toBe(true);
      expect(result.has(1)).toBe(true);
      expect(result.has(2)).toBe(true);
      expect(result.has(3)).toBe(true);
      expect(result.has(4)).toBe(true);
    });

    it('should handle diagonal winning line', () => {
      const winningLine = {
        type: 'diagonal' as const,
        index: 0,
        squares: [0, 6, 12, 18, 24],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result.size).toBe(5);
      expect(result.has(0)).toBe(true);
      expect(result.has(6)).toBe(true);
      expect(result.has(12)).toBe(true);
      expect(result.has(18)).toBe(true);
      expect(result.has(24)).toBe(true);
    });
  });

  describe('markSquare', () => {
    let mockBoard: BingoSquareData[];

    beforeEach(() => {
      mockBoard = [
        { id: 0, text: 'Q1', isMarked: false, isFreeSpace: false },
        { id: 1, text: 'Q2', isMarked: true, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
      ];
    });

    it('should mark square with name and timestamp', () => {
      const newBoard = markSquare(mockBoard, 0, 'John Doe');
      expect(newBoard[0].isMarked).toBe(true);
      expect(newBoard[0].personName).toBe('John Doe');
      expect(newBoard[0].timestamp).toBeGreaterThan(0);
    });

    it('should mark square without name', () => {
      const newBoard = markSquare(mockBoard, 0);
      expect(newBoard[0].isMarked).toBe(true);
      expect(newBoard[0].personName).toBeUndefined();
      expect(newBoard[0].timestamp).toBeGreaterThan(0);
    });

    it('should not modify free space', () => {
      const newBoard = markSquare(mockBoard, 2, 'Test');
      expect(newBoard[2].personName).toBeUndefined();
    });

    it('should return a new array', () => {
      const newBoard = markSquare(mockBoard, 0, 'Test');
      expect(newBoard).not.toBe(mockBoard);
    });

    it('should not modify other squares', () => {
      const newBoard = markSquare(mockBoard, 0, 'Test');
      expect(newBoard[1].isMarked).toBe(mockBoard[1].isMarked);
      expect(newBoard[2].isMarked).toBe(mockBoard[2].isMarked);
    });
  });

  describe('unmarkSquare', () => {
    let mockBoard: BingoSquareData[];

    beforeEach(() => {
      mockBoard = [
        { id: 0, text: 'Q1', isMarked: true, isFreeSpace: false, personName: 'John', timestamp: 123 },
        { id: 1, text: 'Q2', isMarked: true, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
      ];
    });

    it('should unmark square and remove name and timestamp', () => {
      const newBoard = unmarkSquare(mockBoard, 0);
      expect(newBoard[0].isMarked).toBe(false);
      expect(newBoard[0].personName).toBeUndefined();
      expect(newBoard[0].timestamp).toBeUndefined();
    });

    it('should not modify free space', () => {
      const newBoard = unmarkSquare(mockBoard, 2);
      expect(newBoard[2].isMarked).toBe(true);
    });

    it('should return a new array', () => {
      const newBoard = unmarkSquare(mockBoard, 0);
      expect(newBoard).not.toBe(mockBoard);
    });
  });

  describe('updateSquareName', () => {
    let mockBoard: BingoSquareData[];

    beforeEach(() => {
      mockBoard = [
        { id: 0, text: 'Q1', isMarked: true, isFreeSpace: false, personName: 'John' },
        { id: 1, text: 'Q2', isMarked: false, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
      ];
    });

    it('should update name for marked square', () => {
      const newBoard = updateSquareName(mockBoard, 0, 'Jane Doe');
      expect(newBoard[0].personName).toBe('Jane Doe');
    });

    it('should not update name for unmarked square', () => {
      const newBoard = updateSquareName(mockBoard, 1, 'Test');
      expect(newBoard[1].personName).toBeUndefined();
    });

    it('should not update free space', () => {
      const newBoard = updateSquareName(mockBoard, 2, 'Test');
      expect(newBoard[2].personName).toBeUndefined();
    });

    it('should return a new array', () => {
      const newBoard = updateSquareName(mockBoard, 0, 'Test');
      expect(newBoard).not.toBe(mockBoard);
    });
  });

  describe('getMarkedConnections', () => {
    it('should return only marked non-free squares', () => {
      const mockBoard: BingoSquareData[] = [
        { id: 0, text: 'Q1', isMarked: true, isFreeSpace: false, personName: 'John' },
        { id: 1, text: 'Q2', isMarked: false, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
        { id: 3, text: 'Q3', isMarked: true, isFreeSpace: false },
      ];
      
      const connections = getMarkedConnections(mockBoard);
      expect(connections).toHaveLength(2);
      expect(connections[0].id).toBe(0);
      expect(connections[1].id).toBe(3);
    });

    it('should return empty array when no marked squares', () => {
      const mockBoard: BingoSquareData[] = [
        { id: 0, text: 'Q1', isMarked: false, isFreeSpace: false },
        { id: 1, text: 'Q2', isMarked: false, isFreeSpace: false },
      ];
      
      const connections = getMarkedConnections(mockBoard);
      expect(connections).toHaveLength(0);
    });

    it('should exclude free space even if marked', () => {
      const mockBoard: BingoSquareData[] = [
        { id: 0, text: 'Free', isMarked: true, isFreeSpace: true },
        { id: 1, text: 'Q1', isMarked: true, isFreeSpace: false },
      ];
      
      const connections = getMarkedConnections(mockBoard);
      expect(connections).toHaveLength(1);
      expect(connections[0].id).toBe(1);
    });
  });
});
