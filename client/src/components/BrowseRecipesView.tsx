import React from 'react';
import { Recipe } from '../types';
import { SAMPLE_RECIPES } from '../data/recipes';
import { BookOpen, Clock, Utensils, ArrowRight } from 'lucide-react';

interface BrowseRecipesViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipes?: Recipe[];
}

export const BrowseRecipesView: React.FC<BrowseRecipesViewProps> = ({
  onSelectRecipe,
  savedRecipes = [],
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-12 py-8 lg:py-12 space-y-12 font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em] mb-2">
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
          <span>EDITORIAL ARCHIVE</span>
        </div>
        <h1 className="font-['Syne'] text-3xl md:text-5xl font-black uppercase text-[#F5F5F5] tracking-tight">
          CURATED FRIDGE RECIPES
        </h1>
        <p className="font-['Space_Grotesk'] text-base text-white/60 italic mt-2">
          Hand-crafted recipes built around common pantry staples and seasonal garden produce.
        </p>
      </div>

      {/* Saved Recipes Section (if any) */}
      {savedRecipes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-['Syne'] text-2xl font-black uppercase text-[#F5F5F5] flex items-center gap-2">
            <span>MY SAVED RECIPES</span>
            <span className="font-mono text-xs text-[#FF3E00]">({savedRecipes.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRecipe(r)}
                className="bg-[#121212] border border-white/20 hover:border-[#FF3E00] transition-all rounded-none overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                <div className="h-44 bg-[#181818] overflow-hidden relative">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                  />
                  <div className="absolute top-2 right-2 bg-[#FF3E00] text-black text-[10px] font-mono font-bold uppercase px-2 py-0.5">
                    Saved
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase text-[#FF3E00] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{r.prepTime}</span>
                      <span>•</span>
                      <span>{r.ingredients.length} Ingredients</span>
                    </div>
                    <h3 className="font-['Syne'] text-lg font-bold text-[#F5F5F5] group-hover:text-[#FF3E00] transition-colors leading-snug">
                      {r.title}
                    </h3>
                    <p className="font-['Space_Grotesk'] text-xs text-white/60 line-clamp-2 italic mt-1">
                      {r.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono text-[#FF3E00] font-bold uppercase">
                    <span>Cook Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classic Curated Collection */}
      <div className="space-y-6">
        <h2 className="font-['Syne'] text-2xl font-black uppercase text-[#F5F5F5]">
          Classic Pantry Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAMPLE_RECIPES.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectRecipe(r)}
              className="bg-[#121212] border border-white/20 hover:border-[#FF3E00] transition-all rounded-none overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="h-48 bg-[#181818] overflow-hidden relative">
                <img
                  src={r.imageUrl}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {r.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FF3E00] text-black text-[10px] uppercase font-mono font-bold px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase text-white/50 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#FF3E00]" />
                    <span>{r.prepTime}</span>
                    <span>•</span>
                    <span>{r.servings} Servings</span>
                  </div>
                  <h3 className="font-['Syne'] text-xl font-bold text-[#F5F5F5] group-hover:text-[#FF3E00] transition-colors leading-tight mb-2">
                    {r.title}
                  </h3>
                  <p className="font-['Space_Grotesk'] text-xs text-white/60 italic leading-relaxed">
                    {r.tagline}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center font-['Space_Grotesk'] text-xs uppercase font-bold text-[#F5F5F5] group-hover:text-[#FF3E00]">
                  <span>View Full Recipe</span>
                  <ArrowRight className="w-4 h-4 stroke-[2] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
