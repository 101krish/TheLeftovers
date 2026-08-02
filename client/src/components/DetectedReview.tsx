import React, { useState } from 'react';
import { Sparkles, Trash2, Plus, ArrowLeft, RefreshCw, X, AlertCircle } from 'lucide-react';

interface DetectedIngredient {
  name: string;
  confidence: 'high' | 'medium' | 'low';
}

interface DetectedReviewProps {
  ingredients: DetectedIngredient[];
  imagePreview: string | null;
  onConfirm: (ingredientsString: string) => void;
  onCancel: () => void;
}

export const DetectedReview: React.FC<DetectedReviewProps> = ({
  ingredients,
  imagePreview,
  onConfirm,
  onCancel,
}) => {
  const [list, setList] = useState<DetectedIngredient[]>(ingredients);
  const [newIngredient, setNewIngredient] = useState('');

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;

    // Avoid duplicate names
    const cleanName = newIngredient.trim().toLowerCase();
    if (!list.some((item) => item.name === cleanName)) {
      setList([...list, { name: cleanName, confidence: 'high' }]);
    }
    setNewIngredient('');
  };

  const handleRemoveIngredient = (nameToRemove: string) => {
    setList(list.filter((item) => item.name !== nameToRemove));
  };

  const handleGenerate = () => {
    if (list.length === 0) return;
    // Join names as comma-separated string to pass to the existing flow
    const ingredientsString = list.map((item) => item.name).join(', ');
    onConfirm(ingredientsString);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 font-['Space_Grotesk',sans-serif]">
      {/* Title Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>STEP 02 — CONFIRM INGREDIENTS</span>
          </div>
          <h1 className="font-['Syne',sans-serif] text-3xl md:text-5xl font-black text-[#F5F5F5] tracking-tight uppercase">
            REVIEW DETECTED STAPLES
          </h1>
          <p className="font-['Space_Grotesk'] text-sm md:text-base text-white/60 leading-relaxed mt-2 max-w-xl">
            Confirm or correct the ingredients spotted in your photo. Tap any item to remove it, or add missing ones below.
          </p>
        </div>
        
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors bg-transparent border-0 self-start md:self-end"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Review List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chips Grid */}
          <div className="border-2 border-white/10 p-6 bg-[#0a0a0a] min-h-[160px] flex flex-wrap gap-3 items-content-start relative">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full py-8 text-center text-white/30 space-y-2">
                <AlertCircle className="w-6 h-6 text-[#FF3E00]/60" />
                <p className="text-xs font-bold uppercase tracking-wider">No ingredients listed</p>
                <p className="text-[11px] max-w-xs font-normal">Add some ingredients below to activate recipe generation.</p>
              </div>
            ) : (
              list.map((item) => {
                const isLowConfidence = item.confidence === 'low';
                return (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isLowConfidence
                        ? 'border-2 border-dashed border-[#FF3E00]/60 bg-[#1e1210]/60 text-white/90'
                        : 'border border-white/20 bg-[#121212] text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isLowConfidence && (
                      <span className="text-[9px] font-mono text-[#FF3E00]/70 lowercase font-medium">
                        (low conf)
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveIngredient(item.name)}
                      className="text-white/40 hover:text-[#FF3E00] transition-colors p-0.5"
                      title={`Remove ${item.name}`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Missed Ingredient Inline Form */}
          <form onSubmit={handleAddIngredient} className="flex gap-3">
            <input
              type="text"
              placeholder="Add another ingredient (e.g. butter, parmesan)..."
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              className="flex-1 bg-[#121212] border-2 border-white/20 px-4 py-3 text-sm font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00] transition-all rounded-none"
            />
            <button
              type="submit"
              className="bg-[#181818] border border-white/20 hover:border-[#FF3E00] text-white font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Action Buttons */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={list.length === 0}
              className={`w-full bg-[#FF3E00] text-black font-['Space_Grotesk'] text-sm font-black uppercase tracking-[0.2em] py-4 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                list.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 stroke-[3]" />
              <span>Generate Recipe</span>
            </button>
            {list.length === 0 && (
              <p className="text-[10px] text-center text-white/40 font-mono mt-2 uppercase tracking-wider">
                * Add at least one ingredient to generate a recipe
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Image Thumbnail Preview */}
        {imagePreview && (
          <div className="lg:col-span-4 space-y-3">
            <span className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Captured Image
            </span>
            <div className="border border-white/20 bg-[#121212] p-2 aspect-square relative overflow-hidden group">
              <img
                src={imagePreview}
                alt="Captured ingredients"
                className="w-full h-full object-cover filter contrast-105 brightness-95"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
