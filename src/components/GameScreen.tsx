import type { BingoSquareData } from '../types';
import { BingoBoard } from './BingoBoard';

interface GameScreenProps {
  board: BingoSquareData[];
  winningSquareIds: Set<number>;
  hasBingo: boolean;
  onSquareClick: (squareId: number) => void;
  onReset: () => void;
  onOpenConnections: () => void;
  connectionCount: number;
}

export function GameScreen({
  board,
  winningSquareIds,
  hasBingo,
  onSquareClick,
  onReset,
  onOpenConnections,
  connectionCount,
}: GameScreenProps) {
  return (
    <div className="flex flex-col min-h-full bg-linear-to-br from-metal-black via-metal-darker to-lightning-purple/20">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-metal-darker border-b-2 border-electric-blue shadow-glow-blue">
        <button
          onClick={onReset}
          className="text-electric-blue text-lg px-4 py-2 border border-electric-blue/50 hover:bg-electric-blue/20 active:animate-[shake_0.2s_ease] uppercase tracking-wide beveled"
          style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}
        >
          ← Back
        </button>
        <h1 className="chrome-text font-bold text-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>SOC OPS</h1>
        <button
          onClick={onOpenConnections}
          className="text-fire-orange text-lg px-4 py-2 border border-fire-orange/50 hover:bg-fire-orange/20 active:animate-[shake_0.2s_ease] uppercase tracking-wide beveled relative"
          style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}
        >
          ⚡ {connectionCount}
          {connectionCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-fire-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-red">
              {connectionCount}
            </span>
          )}
        </button>
      </header>

      {/* Instructions */}
      <p className="text-center text-electric-purple text-lg py-3 px-4 uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
        ⚡ Tap a square when you find a match ⚡
      </p>

      {/* Bingo indicator */}
      {hasBingo && (
        <div className="bg-linear-to-r from-fire-red via-fire-orange to-fire-yellow text-white text-center py-3 font-bold text-2xl shadow-glow-amber uppercase tracking-widest animate-[lightningFlash_1s_infinite] border-y-4 border-molten-amber" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          🤘 BINGO! YOU GOT A LINE! 🤘
        </div>
      )}

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <BingoBoard
          board={board}
          winningSquareIds={winningSquareIds}
          onSquareClick={onSquareClick}
        />
      </div>
    </div>
  );
}
