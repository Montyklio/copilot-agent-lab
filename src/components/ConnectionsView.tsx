import { useState } from 'react';
import type { BingoSquareData } from '../types';

interface ConnectionsViewProps {
  connections: BingoSquareData[];
  onClose: () => void;
  onEditConnection: (squareId: number) => void;
}

export function ConnectionsView({ connections, onClose, onEditConnection }: ConnectionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort by timestamp (most recent first)
  const sortedConnections = [...connections].sort((a, b) => {
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    return timeB - timeA;
  });

  // Filter by search query
  const filteredConnections = sortedConnections.filter((conn) => {
    const query = searchQuery.toLowerCase();
    return (
      conn.text.toLowerCase().includes(query) ||
      (conn.personName && conn.personName.toLowerCase().includes(query))
    );
  });

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const exportConnections = () => {
    const text = filteredConnections
      .map((conn, idx) => {
        const name = conn.personName || 'Anonymous';
        const time = formatTimestamp(conn.timestamp);
        return `${idx + 1}. ${name} - "${conn.text}"${time ? ` (${time})` : ''}`;
      })
      .join('\n');

    const header = '⚡ SOC OPS CONNECTIONS ⚡\n' + '='.repeat(30) + '\n\n';
    const footer = '\n\n' + '='.repeat(30) + `\nTotal: ${filteredConnections.length} connections`;
    const fullText = header + text + footer;

    navigator.clipboard.writeText(fullText).then(() => {
      alert('Connections copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-[lightningFlash_0.3s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-linear-to-br from-metal-darker to-metal-black border-4 border-electric-blue w-full max-w-2xl max-h-[90vh] flex flex-col shadow-glow-blue animate-[scaleIn_0.4s_ease-out] beveled">
        {/* Header */}
        <div className="p-6 border-b-2 border-electric-purple/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="chrome-text font-bold text-2xl uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              ⚡ Connections
            </h2>
            <button
              onClick={onClose}
              className="text-chrome-mid hover:text-chrome-light text-2xl leading-none px-2 active:animate-[shake_0.2s_ease]"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections..."
            className="w-full bg-metal-dark border-2 border-electric-purple/40 text-chrome-light px-4 py-2 text-sm focus:border-electric-blue focus:outline-none focus:shadow-glow-blue transition-all beveled"
            style={{ fontFamily: 'Teko, sans-serif', fontWeight: 500 }}
          />
        </div>

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredConnections.length === 0 ? (
            <div className="text-center text-chrome-mid py-8">
              <p className="text-lg uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
                {connections.length === 0
                  ? '⚡ No connections yet ⚡'
                  : 'No matches found'}
              </p>
            </div>
          ) : (
            filteredConnections.map((conn) => (
              <button
                key={conn.id}
                onClick={() => onEditConnection(conn.id)}
                className="w-full bg-metal-dark border-2 border-fire-red/40 p-4 text-left hover:border-fire-red hover:shadow-glow-red active:scale-98 transition-all beveled"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-fire-yellow text-lg">⚡</span>
                      <span className="text-chrome-light font-bold text-base uppercase tracking-wide truncate" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
                        {conn.personName || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-electric-purple text-sm uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 500 }}>
                      {conn.text}
                    </p>
                    {conn.timestamp && (
                      <p className="text-chrome-dark text-xs mt-1" style={{ fontFamily: 'Teko, sans-serif' }}>
                        {formatTimestamp(conn.timestamp)}
                      </p>
                    )}
                  </div>
                  <span className="text-electric-blue text-xs uppercase" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
                    Edit →
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-electric-purple/30 space-y-3">
          <div className="text-center text-chrome-mid text-sm uppercase tracking-wide" style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600 }}>
            {filteredConnections.length} of {connections.length} connections
          </div>
          
          <button
            onClick={exportConnections}
            disabled={filteredConnections.length === 0}
            className="w-full bg-linear-to-r from-electric-blue to-electric-purple text-white font-bold py-3 px-4 text-lg uppercase tracking-wider border-2 border-electric-blue hover:scale-105 active:scale-95 active:animate-[shake_0.2s_ease] transition-all disabled:opacity-50 disabled:cursor-not-allowed beveled"
            style={{ fontFamily: 'Teko, sans-serif', fontWeight: 600, animation: filteredConnections.length > 0 ? 'electricPulse 2s infinite' : 'none' }}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
