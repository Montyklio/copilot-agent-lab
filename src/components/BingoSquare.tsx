import type { BingoSquareData } from '../types';

interface BingoSquareProps {
  square: BingoSquareData;
  isWinning: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinning, onClick }: BingoSquareProps) {
  const baseClasses =
    'relative flex items-center justify-center p-2 text-center border-2 beveled transition-all duration-100 select-none min-h-[60px] text-xs leading-tight font-semibold uppercase';

  let stateClasses = '';
  let animation = '';
  
  if (square.isFreeSpace) {
    stateClasses = 'bg-linear-to-br from-chrome-light via-chrome-mid to-chrome-dark border-chrome-light text-metal-black font-bold text-sm chrome-text';
  } else if (square.isMarked) {
    if (isWinning) {
      stateClasses = 'bg-linear-to-br from-molten-amber via-fire-yellow to-fire-orange border-molten-amber text-metal-black';
      animation = 'animate-[electricPulse_1.5s_infinite]';
    } else {
      stateClasses = 'bg-linear-to-br from-fire-red to-fire-orange border-fire-red text-white';
      animation = 'shadow-glow-red';
    }
  } else {
    stateClasses = 'bg-metal-dark border-electric-purple/40 text-chrome-light hover:border-electric-blue hover:bg-metal-gray hover:shadow-glow-blue active:scale-95 active:animate-[shake_0.2s_ease]';
  }

  return (
    <button
      onClick={onClick}
      disabled={square.isFreeSpace}
      className={`${baseClasses} ${stateClasses} ${animation}`}
      style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}
      aria-pressed={square.isMarked}
      aria-label={square.isFreeSpace ? 'Free space' : square.text}
    >
      <span className="wrap-break-word hyphens-auto">{square.text}</span>
      {square.isMarked && !square.isFreeSpace && (
        <span className="absolute top-1 right-1 text-fire-yellow text-lg drop-shadow-[0_0_3px_rgba(255,170,0,1)]">⚡</span>
      )}
    </button>
  );
}
