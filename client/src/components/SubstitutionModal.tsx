import React, { useState, useEffect } from 'react';
import { IngredientItem } from '../types';
import { COMMON_SUBSTITUTIONS } from '../data/recipes';
import { X, ArrowLeftRight, Sparkles, Check, Loader2 } from 'lucide-react';

interface SubstitutionModalProps {
  ingredient: IngredientItem | null;
  onClose: () => void;
  onApplySubstitution: (originalId: string, newIngredientName: string) => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  ingredient,
  onClose,
  onApplySubstitution,
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSubstitutes, setAiSubstitutes] = useState<string[]>([]);
  const [aiReason, setAiReason] = useState<string>('');
  const [customSubInput, setCustomSubInput] = useState('');

  useEffect(() => {
    if (!ingredient) return;

    // Reset AI state
    setAiSubstitutes([]);
    setAiReason('');

    // Check if we have standard presets
    const lower = ingredient.name.toLowerCase();
    const matchedKey = Object.keys(COMMON_SUBSTITUTIONS).find((k) =>
      lower.includes(k)
    );

    if (matchedKey) {
      setAiSubstitutes(COMMON_SUBSTITUTIONS[matchedKey]);
      setAiReason(`Standard culinary substitutes for ${ingredient.name}.`);
    } else {
      // Fetch from API
      fetchAiSubstitutes(ingredient.name);
    }
  }, [ingredient]);

  const fetchAiSubstitutes = async (name: string) => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/swap-ingredient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: name }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiSubstitutes(data.data.substitutes || []);
        setAiReason(data.data.reason || '');
      } else {
        // Fallback
        setAiSubstitutes(['Alternative ingredient of your choice']);
      }
    } catch (e) {
      console.error(e);
      setAiSubstitutes(['Alternative ingredient of your choice']);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!ingredient) return null;

  const handleSelect = (subName: string) => {
    onApplySubstitution(ingredient.id, subName);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubInput.trim()) return;
    onApplySubstitution(ingredient.id, customSubInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-['Space_Grotesk',sans-serif]">
      <div className="bg-[#121212] border-2 border-white/20 w-full max-w-lg p-6 md:p-8 shadow-2xl relative space-y-6 text-[#F5F5F5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-[#FF3E00] hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 text-[#FF3E00] text-xs font-mono font-bold uppercase tracking-[0.25em] mb-2">
            <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            <span>INGREDIENT SWAP</span>
          </div>
          <h3 className="font-['Syne'] text-2xl md:text-3xl font-black uppercase tracking-tight text-[#F5F5F5]">
            SUBSTITUTE FOR "{ingredient.name}"
          </h3>
          <p className="font-['Space_Grotesk'] text-xs text-white/60 italic mt-1">
            Swap this ingredient to fit what is available in your pantry.
          </p>
        </div>

        {/* AI or Preset Recommendations */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white/80">
            <span>Recommended Substitutes:</span>
            {loadingAi && (
              <span className="flex items-center gap-1 font-mono text-[#FF3E00]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Finding swaps...
              </span>
            )}
          </div>

          {aiReason && (
            <p className="font-['Space_Grotesk'] text-xs text-white/70 bg-[#181818] p-3 border border-white/10">
              {aiReason}
            </p>
          )}

          <div className="space-y-2">
            {aiSubstitutes.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(sub)}
                className="w-full text-left p-3.5 bg-[#181818] hover:bg-[#FF3E00] hover:text-black border border-white/10 hover:border-[#FF3E00] transition-all font-['Space_Grotesk'] text-sm font-bold flex justify-between items-center group cursor-pointer"
              >
                <span>{sub}</span>
                <span className="text-xs font-mono font-bold uppercase text-[#FF3E00] group-hover:text-black flex items-center gap-1">
                  Swap →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Substitute Input */}
        <form onSubmit={handleCustomSubmit} className="pt-4 border-t border-white/10 space-y-2">
          <label htmlFor="custom-sub-input" className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider text-white/80">
            Or enter custom swap:
          </label>
          <div className="flex gap-2">
            <input
              id="custom-sub-input"
              type="text"
              value={customSubInput}
              onChange={(e) => setCustomSubInput(e.target.value)}
              placeholder="e.g. Goat cheese or Nutritional yeast"
              className="flex-1 bg-[#181818] border border-white/20 px-3.5 py-2.5 text-sm font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00]"
            />
            <button
              type="submit"
              disabled={!customSubInput.trim()}
              className="bg-[#FF3E00] hover:bg-white text-black px-5 py-2.5 text-xs font-['Space_Grotesk'] font-black uppercase tracking-widest disabled:opacity-30 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
