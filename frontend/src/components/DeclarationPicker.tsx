"use client";

import { useState, useEffect } from "react";

interface Declaration {
  id: string;
  title: string;
  artistName: string;
  transparencyScore: number;
  createdAt: string;
  badge?: string;
}

interface DeclarationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (declarationId: string, title: string) => void;
  currentArtist?: string;
}

export function DeclarationPicker({ isOpen, onClose, onSelect, currentArtist }: DeclarationPickerProps) {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/declarations?limit=100")
        .then((res) => res.json())
        .then((data) => {
          // Filter to current artist's declarations if available
          const filtered = currentArtist
            ? data.declarations.filter((d: Declaration) => d.artistName === currentArtist)
            : data.declarations;
          setDeclarations(filtered);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load declarations:", err);
          setLoading(false);
        });
    }
  }, [isOpen, currentArtist]);

  const filteredDeclarations = declarations.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.artistName.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="bg-[#0D0D0D] border border-[#2A2A2A] w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-[#F5F3F0]">Select Source Track</h2>
            <button
              onClick={onClose}
              className="text-[#8A8A8A] hover:text-[#F5F3F0] text-xl leading-none"
            >
              ×
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, artist, or ID..."
            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none text-sm"
            autoFocus
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <p className="text-sm text-[#8A8A8A] text-center py-8">Loading declarations...</p>
          ) : filteredDeclarations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[#8A8A8A] mb-4">
                {search ? "No declarations match your search" : "No declarations found"}
              </p>
              <button
                onClick={onClose}
                className="text-xs text-[#8A8A8A] hover:text-[#F5F3F0] border border-[#2A2A2A] px-3 py-2"
              >
                Close & create original
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDeclarations.map((declaration) => (
                <button
                  key={declaration.id}
                  onClick={() => {
                    onSelect(declaration.id, declaration.title);
                    onClose();
                  }}
                  className="w-full text-left p-4 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F5F3F0] truncate mb-1">{declaration.title}</p>
                      <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
                        <span>{declaration.artistName}</span>
                        <span>·</span>
                        <span>{new Date(declaration.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span className="font-mono">{declaration.id.substring(0, 12)}...</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-[#8A8A8A] mb-1">Score</div>
                      <div className="text-sm text-[#F5F3F0] font-mono">{declaration.transparencyScore}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm text-[#8A8A8A] hover:text-[#F5F3F0] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
