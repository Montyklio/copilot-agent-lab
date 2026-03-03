interface BingoModalProps {
  onDismiss: () => void;
}

export function BingoModal({ onDismiss }: BingoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-[lightningFlash_0.5s_ease-out]">
      <div className="bg-linear-to-br from-metal-darker to-metal-black border-4 border-molten-amber p-8 max-w-sm w-full text-center shadow-glow-amber animate-[explode_0.6s_ease-out] beveled">
        {/* Lightning bolts */}
        <div className="text-7xl mb-4 animate-[shake_0.5s_ease-in-out_infinite]">
          ⚡🤘⚡
        </div>
        
        <h2 className="text-6xl font-black text-glow-amber mb-4 uppercase tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #ffbf00 0%, #ffaa00 50%, #ff6600 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          BINGO!
        </h2>
        
        <p className="text-electric-blue text-xl mb-6 uppercase tracking-wide font-bold" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 700 }}>
          🔥 You Completed a Line! 🔥
        </p>
        
        <div className="h-1 bg-linear-to-r from-transparent via-fire-red to-transparent mb-6 shadow-glow-red" />
        
        <button
          onClick={onDismiss}
          className="w-full bg-linear-to-r from-fire-red via-fire-orange to-fire-yellow text-white font-bold py-4 px-6 text-xl uppercase tracking-wider border-2 border-fire-orange hover:shadow-glow-red active:animate-[shake_0.3s_ease] transition-all beveled"
          style={{ fontFamily: 'Teko, sans-serif', animation: 'fireGlow 2s infinite' }}
        >
          ⚡ Keep Playing ⚡
        </button>
      </div>
    </div>
  );
}
