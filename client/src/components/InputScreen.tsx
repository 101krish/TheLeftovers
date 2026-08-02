import React, { useState } from 'react';
import { Sparkles, ArrowRight, Refrigerator, ChefHat, Check } from 'lucide-react';

interface InputScreenProps {
  onGenerate: (ingredients: string, tags: string[]) => void;
  isLoading: boolean;
  onSelectSampleRecipe: (recipeId: string) => void;
}

const EXAMPLE_CHIPS = [
  'Eggs, baby spinach, feta cheese & red onion',
  'Chickpeas, crushed tomatoes, garlic & kale',
  'Cold rice, eggs, garlic & green onions',
  'Pasta, canned tomatoes, spinach, garlic & basil',
];

const DIETARY_TAGS = ['Vegetarian', 'Gluten-Free', 'Quick (< 20 min)', 'Dairy-Free', 'High Protein'];

export const InputScreen: React.FC<InputScreenProps> = ({
  onGenerate,
  isLoading,
  onSelectSampleRecipe,
}) => {
  const [ingredientsText, setIngredientsText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleChipClick = (chipText: string) => {
    setIngredientsText(chipText);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientsText.trim()) return;
    onGenerate(ingredientsText, selectedTags);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      <div className="mb-10 border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 mb-3 text-[#FF3E00] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.3em]">
          <ChefHat className="w-4 h-4 stroke-[2]" />
          <span>FRIDGE GENERATOR — ISSUE NO. 01</span>
        </div>
        <h1 className="font-['Syne',sans-serif] text-4xl md:text-6xl font-black text-[#F5F5F5] tracking-tighter uppercase leading-[0.9] mb-4">
          WHAT IS IN YOUR <span className="text-[#FF3E00] italic">FRIDGE</span> TODAY?
        </h1>
        <p className="font-['Space_Grotesk'] text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
          List stray ingredients, leftover vegetables, or pantry staples waiting in your crisper. Our AI engine will craft a tailored gourmet recipe instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ingredient Textarea */}
        <div className="space-y-3">
          <label htmlFor="fridge-ingredients-input" className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Available Ingredients
          </label>
          <div className="relative">
            <textarea
              id="fridge-ingredients-input"
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="eggs, spinach, leftover rice, half an onion, feta cheese, garlic, smoked paprika..."
              className="w-full bg-[#121212] border-2 border-white/20 p-5 text-base md:text-lg font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00] transition-all resize-y rounded-none"
              disabled={isLoading}
            />
            {ingredientsText.length > 0 && (
              <button
                type="button"
                onClick={() => setIngredientsText('')}
                className="absolute top-4 right-4 text-xs font-mono text-white/40 hover:text-[#FF3E00] uppercase tracking-wider font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tappable Example Chips */}
        <div className="space-y-3">
          <span className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            Or tap a pre-matched ingredient combination:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {EXAMPLE_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs font-['Space_Grotesk'] bg-[#181818] hover:bg-[#222222] border border-white/20 hover:border-[#FF3E00] px-3.5 py-2.5 text-white/90 transition-all text-left flex items-center gap-2 font-medium"
              >
                <span className="text-[#FF3E00] font-bold">+</span>
                <span>{chip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences / Filters */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <span className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            Dietary Constraints:
          </span>
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider px-3.5 py-2 transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                      : 'bg-[#121212] text-white/70 border-white/20 hover:border-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isLoading || !ingredientsText.trim()}
            className="bg-[#FF3E00] hover:bg-white text-black font-['Space_Grotesk'] text-sm font-black uppercase tracking-[0.2em] px-10 py-5 transition-all flex items-center justify-center gap-3 disabled:opacity-30 cursor-pointer shadow-lg hover:shadow-[#FF3E00]/20"
          >
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
            <span>Generate Recipe</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <span className="text-xs text-white/40 uppercase tracking-widest font-mono text-center sm:text-right">
            Instant Studio Execution
          </span>
        </div>
      </form>

      {/* Featured Classic Recipes Direct Shortcuts */}
      <div className="mt-16 pt-10 border-t border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-['Syne'] text-2xl font-black uppercase text-[#F5F5F5] tracking-tight">
            Curated Kitchen Staples
          </h3>
          <span className="font-mono text-xs text-[#FF3E00] uppercase font-bold tracking-widest">3 CLASSICS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <button
            onClick={() => onSelectSampleRecipe('rustic-frittata')}
            className="text-left p-5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/20 hover:border-[#FF3E00] transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="bg-[#FF3E00] text-black text-[10px] uppercase font-bold font-mono px-2 py-0.5 mb-3 inline-block">
                Vegetarian
              </span>
              <h4 className="font-['Syne'] text-lg font-bold text-white group-hover:text-[#FF3E00] transition-colors mb-2">
                Rustic Vegetable Frittata
              </h4>
              <p className="font-['Space_Grotesk'] text-xs text-white/60 line-clamp-2">
                Eggs, baby spinach, feta cheese, red onion & smoked paprika.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] font-mono font-bold text-white/50">
              <span>20 MIN</span>
              <span className="text-[#FF3E00] group-hover:translate-x-1 transition-transform">COOK NOW →</span>
            </div>
          </button>

          <button
            onClick={() => onSelectSampleRecipe('chickpea-stew')}
            className="text-left p-5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/20 hover:border-[#FF3E00] transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="bg-white text-black text-[10px] uppercase font-bold font-mono px-2 py-0.5 mb-3 inline-block">
                Vegan
              </span>
              <h4 className="font-['Syne'] text-lg font-bold text-white group-hover:text-[#FF3E00] transition-colors mb-2">
                Spiced Moroccan Chickpea Stew
              </h4>
              <p className="font-['Space_Grotesk'] text-xs text-white/60 line-clamp-2">
                Chickpeas, crushed tomatoes, garlic, cumin & kale.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] font-mono font-bold text-white/50">
              <span>25 MIN</span>
              <span className="text-[#FF3E00] group-hover:translate-x-1 transition-transform">COOK NOW →</span>
            </div>
          </button>

          <button
            onClick={() => onSelectSampleRecipe('crispy-rice-skillet')}
            className="text-left p-5 bg-[#121212] hover:bg-[#1a1a1a] border border-white/20 hover:border-[#FF3E00] transition-all group flex flex-col justify-between"
          >
            <div>
              <span className="bg-[#333333] text-white text-[10px] uppercase font-bold font-mono px-2 py-0.5 mb-3 inline-block">
                Quick
              </span>
              <h4 className="font-['Syne'] text-lg font-bold text-white group-hover:text-[#FF3E00] transition-colors mb-2">
                Crispy Garlic Rice & Egg Skillet
              </h4>
              <p className="font-['Space_Grotesk'] text-xs text-white/60 line-clamp-2">
                Cold rice, fried eggs, sliced garlic & scallions.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] font-mono font-bold text-white/50">
              <span>15 MIN</span>
              <span className="text-[#FF3E00] group-hover:translate-x-1 transition-transform">COOK NOW →</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
