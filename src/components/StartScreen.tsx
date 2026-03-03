interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-linear-to-br from-metal-black via-metal-darker to-lightning-purple/20">
      <div className="text-center max-w-md animate-[scaleIn_0.6s_ease-out]">
        {/* Lightning accent lines */}
        <div className="h-1 bg-linear-to-r from-transparent via-electric-blue to-transparent mb-6 shadow-glow-blue" />
        
        <h1 className="chrome-text text-7xl font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          SOC OPS
        </h1>
        <p className="text-2xl text-fire-orange mb-8 uppercase tracking-widest" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
          Social Bingo
        </p>
        
        <div className="bg-metal-darker/80 border-2 border-electric-purple/50 p-6 mb-8 backdrop-blur-sm shadow-glow-blue" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
          <h2 className="font-bold text-electric-blue mb-4 text-xl uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif' }}>▶ How to play</h2>
          <ul className="text-left text-chrome-light space-y-3" style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.125rem', fontWeight: 500 }}>
            <li>⚡ Find people who match the questions</li>
            <li>🔥 Tap a square when you find a match</li>
            <li>🤘 Get 5 in a row to win!</li>
          </ul>
        </div>

        {/* Lightning accent lines */}
        <div className="h-1 bg-linear-to-r from-transparent via-fire-red to-transparent mb-6 shadow-glow-red" />

        <button
          onClick={onStart}
          className="w-full bg-linear-to-r from-fire-red via-fire-orange to-fire-yellow text-white font-bold py-5 px-8 text-2xl uppercase tracking-wider border-2 border-fire-orange hover:shadow-glow-red active:animate-[shake_0.3s_ease] transition-all duration-150 hover:scale-105 beveled"
          style={{ fontFamily: 'Teko, sans-serif', animation: 'fireGlow 2s infinite' }}
        >
          ⚡ Start Game ⚡
        </button>
      </div>
    </div>
  );
}
