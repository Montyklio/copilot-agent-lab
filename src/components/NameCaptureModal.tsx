import { useState, useRef, useEffect } from 'react';

interface NameCaptureModalProps {
  promptText: string;
  existingName?: string;
  isMarked: boolean;
  onSave: (name: string) => void;
  onSkip: () => void;
  onUnmark?: () => void;
  onCancel: () => void;
}

export function NameCaptureModal({
  promptText,
  existingName = '',
  isMarked,
  onSave,
  onSkip,
  onUnmark,
  onCancel,
}: NameCaptureModalProps) {
  const [name, setName] = useState(existingName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    } else {
      onSkip();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-[lightningFlash_0.3s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="bg-linear-to-br from-metal-darker to-metal-black border-4 border-electric-blue p-6 max-w-md w-full shadow-glow-blue animate-[scaleIn_0.4s_ease-out] beveled">
        {/* Header */}
        <div className="mb-4">
          <h2 className="chrome-text font-bold text-xl mb-2 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            {isMarked ? '⚡ Edit Connection' : '⚡ New Connection'}
          </h2>
          <p className="text-electric-purple text-sm uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
            {promptText}
          </p>
        </div>

        {/* Accent line */}
        <div className="h-1 bg-linear-to-r from-transparent via-electric-blue to-transparent mb-4 shadow-glow-blue" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="person-name" 
              className="block text-chrome-light text-sm uppercase tracking-wide mb-2"
              style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}
            >
              Person's Name:
            </label>
            <input
              ref={inputRef}
              id="person-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter name (optional)"
              className="w-full bg-metal-dark border-2 border-electric-purple/40 text-chrome-light px-4 py-3 text-base focus:border-electric-blue focus:outline-none focus:shadow-glow-blue transition-all beveled"
              style={{ fontFamily: 'Teko, sans-serif', fontWeight: 500 }}
              maxLength={50}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-col">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-fire-red via-fire-orange to-fire-yellow text-white font-bold py-3 px-4 text-lg uppercase tracking-wider border-2 border-fire-orange hover:scale-105 active:scale-95 active:animate-[shake_0.2s_ease] transition-all beveled"
              style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600, animation: 'fireGlow 2s infinite' }}
            >
              {name.trim() ? '⚡ Save & Mark ⚡' : '⚡ Mark Without Name ⚡'}
            </button>
            
            {isMarked && onUnmark && (
              <button
                type="button"
                onClick={onUnmark}
                className="w-full bg-metal-dark text-fire-red font-bold py-3 px-4 text-base uppercase tracking-wider border-2 border-fire-red/50 hover:border-fire-red hover:shadow-glow-red active:animate-[shake_0.2s_ease] transition-all beveled"
                style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}
              >
                🔥 Unmark Square
              </button>
            )}
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-metal-dark text-chrome-mid font-semibold py-2 px-4 text-sm uppercase tracking-wide border border-chrome-dark hover:border-chrome-mid hover:text-chrome-light active:animate-[shake_0.2s_ease] transition-all beveled"
              style={{ fontFamily: 'Teko, sans-serif', fontWeight: 500 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
