import React, { useState } from 'react';
import { Recipe, IngredientItem } from '../types';
import {
  Minus,
  Plus,
  ArrowLeftRight,
  ShoppingBag,
  Check,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  BookMarked,
  Share2
} from 'lucide-react';

interface RecipeViewProps {
  recipe: Recipe;
  onOpenSubstitution: (ingredient: IngredientItem) => void;
  onAddMissingToShoppingList: (items: string[]) => void;
  onStartTimer: (minutes: number, label: string) => void;
  onSaveRecipe?: (recipe: Recipe) => void;
  isSaved?: boolean;
  recipesList?: Recipe[];
  activeRecipeIndex?: number;
  onSelectRecipeIndex?: (index: number) => void;
  onRegenerate?: () => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({
  recipe,
  onOpenSubstitution,
  onAddMissingToShoppingList,
  onStartTimer,
  onSaveRecipe,
  isSaved = false,
  recipesList = [],
  activeRecipeIndex = 0,
  onSelectRecipeIndex,
  onRegenerate,
}) => {
  const [servings, setServings] = useState<number>(recipe.servings || 2);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [addedToList, setAddedToList] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

  // Calculate ratio based on original baseline servings
  const ratio = servings / (recipe.servings || 2);

  const handleServingChange = (delta: number) => {
    setServings((prev) => Math.max(1, prev + delta));
  };

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = recipe.steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const formatAmount = (amount: number, unit: string) => {
    if (!amount) return '';
    const scaled = amount * ratio;
    
    // Format whole numbers or fractional parts nicely
    if (Math.abs(scaled - Math.round(scaled)) < 0.05) {
      return Math.round(scaled).toString();
    }
    
    if (Math.abs(scaled - 0.25) < 0.05) return '1/4';
    if (Math.abs(scaled - 0.33) < 0.05) return '1/3';
    if (Math.abs(scaled - 0.5) < 0.05) return '1/2';
    if (Math.abs(scaled - 0.75) < 0.05) return '3/4';
    if (Math.abs(scaled - 1.5) < 0.05) return '1 1/2';
    if (Math.abs(scaled - 2.5) < 0.05) return '2 1/2';

    return scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);
  };

  const handleAddListClick = () => {
    onAddMissingToShoppingList(recipe.missingIngredients);
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 lg:py-12 font-['Space_Grotesk',sans-serif]">
      {/* Recipe Header */}
      <section className="mb-10 border-b border-white/10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#FF3E00] text-black font-black px-3 py-1 text-[10px] uppercase tracking-[0.2em] rounded-none"
                >
                  {tag}
                </span>
              ))}
              <span className="bg-[#181818] text-[#F5F5F5] border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#FF3E00]" />
                {recipe.prepTime}
              </span>
            </div>

            <h1 className="font-['Syne',sans-serif] text-4xl md:text-6xl font-black text-[#F5F5F5] tracking-tighter uppercase leading-[0.95] mb-4">
              {recipe.title}
            </h1>
            <p className="font-['Space_Grotesk'] text-base md:text-lg text-white/70 italic leading-relaxed">
              {recipe.tagline}
            </p>
          </div>

          {/* Action Bar & Servings Stepper */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Servings Stepper */}
            <div className="flex items-center gap-4 border-2 border-white/20 px-4 py-2 bg-[#121212]">
              <span className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.2em] font-bold text-white/80">
                Servings
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleServingChange(-1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#FF3E00] hover:text-black border border-white/30 transition-colors text-[#F5F5F5] font-bold"
                  aria-label="Decrease Servings"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="font-['Syne'] text-xl font-extrabold w-6 text-center text-[#F5F5F5]">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => handleServingChange(1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#FF3E00] hover:text-black border border-white/30 transition-colors text-[#F5F5F5] font-bold"
                  aria-label="Increase Servings"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Save & Share */}
            <div className="flex gap-2">
              {onSaveRecipe && (
                <button
                  onClick={() => onSaveRecipe(recipe)}
                  className={`px-3.5 py-2 border text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                    isSaved
                      ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                      : 'bg-[#121212] text-[#F5F5F5] border-white/20 hover:border-white'
                  }`}
                  title="Save Recipe"
                >
                  <BookMarked className="w-4 h-4 stroke-[2]" />
                  <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2 border border-white/20 bg-[#121212] text-[#F5F5F5] hover:border-[#FF3E00] hover:text-[#FF3E00] text-xs font-bold transition-colors relative"
                title="Share link"
              >
                <Share2 className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Copy Share Toast */}
        {sharedToast && (
          <div className="mb-4 p-2.5 bg-[#FF3E00] text-black text-xs font-mono font-bold text-center">
            Recipe link copied to clipboard!
          </div>
        )}

        {/* Hero Image */}
        <div className="w-full aspect-[21/9] bg-[#121212] overflow-hidden border-2 border-white/20 relative group">
          <img
            src={recipe.imageUrl}
            alt={recipe.imageAlt || recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter contrast-105 brightness-90"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Ingredients Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="border-l-2 border-[#FF3E00] pl-6">
            <div className="flex justify-between items-baseline mb-6">
              <h3 className="font-['Syne'] text-2xl font-black uppercase text-[#F5F5F5] tracking-tight">
                Ingredients
              </h3>
              <span className="text-xs font-mono font-bold text-[#FF3E00]">
                Scaled for {servings}
              </span>
            </div>

            <ul className="space-y-4">
              {recipe.ingredients.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-baseline group border-b border-white/10 pb-2 transition-all hover:border-[#FF3E00]"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[#FF3E00] font-bold text-base min-w-[38px]">
                      {formatAmount(item.amount, item.unit)} {item.unit}
                    </span>
                    <span className="font-['Space_Grotesk'] text-base text-[#F5F5F5] leading-snug">
                      {item.name}
                    </span>
                  </div>

                  {/* Swap Button per row */}
                  <button
                    onClick={() => onOpenSubstitution(item)}
                    className="opacity-50 group-hover:opacity-100 transition-opacity p-1 text-white/50 hover:text-[#FF3E00] hover:bg-white/10 rounded-none ml-2 shrink-0"
                    title={`Substitute ${item.name}`}
                  >
                    <ArrowLeftRight className="w-4 h-4 stroke-[2]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Pantry Items Callout */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div className="bg-[#121212] p-6 border-2 border-[#FF3E00]/60">
              <h4 className="font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF3E00] mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                Pantry Staples Needed
              </h4>
              <p className="font-['Space_Grotesk'] text-xs text-white/60 mb-3">
                Ensure you have these essential pantry staples on hand:
              </p>
              <ul className="space-y-2 mb-6">
                {recipe.missingIngredients.map((missing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 font-['Space_Grotesk'] text-sm font-semibold text-white/90"
                  >
                    <span className="w-1.5 h-1.5 bg-[#FF3E00] shrink-0" />
                    <span>{missing}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleAddListClick}
                className={`w-full border py-3 px-4 font-['Space_Grotesk'] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedToList
                    ? 'bg-[#FF3E00] text-black border-[#FF3E00]'
                    : 'border-white/30 text-white hover:bg-[#FF3E00] hover:text-black hover:border-[#FF3E00]'
                }`}
              >
                {addedToList ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add Missing to List</span>
                  </>
                )}
              </button>
            </div>
          )}
        </aside>

        {/* Preparation Steps */}
        <section className="lg:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <h3 className="font-['Syne'] text-2xl font-black uppercase text-[#F5F5F5] tracking-tight">
              Preparation
            </h3>

            {/* Step Progress Tracker */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-white/60">
                {completedCount} / {totalSteps} STEPS
              </span>
              <div className="w-28 h-2 bg-[#1a1a1a] overflow-hidden border border-white/20">
                <div
                  className="bg-[#FF3E00] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist of Steps */}
          <div className="space-y-8">
            {recipe.steps.map((step) => {
              const isChecked = !!completedSteps[step.id];
              return (
                <div key={step.id} className="flex gap-4 md:gap-6 items-start group">
                  {/* Step Checkbox */}
                  <div className="pt-1 shrink-0">
                    <input
                      type="checkbox"
                      id={`step-check-${step.id}`}
                      checked={isChecked}
                      onChange={() => toggleStep(step.id)}
                      className="step-checkbox w-6 h-6 border-2 border-white/30 bg-[#121212] rounded-none text-[#FF3E00] focus:ring-[#FF3E00] cursor-pointer accent-[#FF3E00]"
                    />
                  </div>

                  {/* Step Content */}
                  <div
                    className={`flex-1 transition-all duration-300 ${
                      isChecked ? 'opacity-40 line-through' : 'opacity-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-baseline gap-3">
                        <span className="font-['Syne'] text-2xl font-black text-[#FF3E00]">
                          0{step.number}.
                        </span>
                        <h4 className="font-['Syne'] text-base font-bold text-[#F5F5F5] uppercase tracking-wider">
                          {step.title}
                        </h4>
                      </div>

                      {/* Timer Shortcut button if step has duration */}
                      {step.timerMinutes && (
                        <button
                          type="button"
                          onClick={() => onStartTimer(step.timerMinutes!, `${step.title} Timer`)}
                          className="no-underline inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3E00] text-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-wider transition-colors cursor-pointer hover:bg-white"
                        >
                          <Play className="w-3 h-3 stroke-[3] fill-current" />
                          <span>Start {step.timerMinutes}m Timer</span>
                        </button>
                      )}
                    </div>

                    <p className="font-['Space_Grotesk'] text-base md:text-lg text-white/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chef Note Quote */}
          {recipe.chefNote && (
            <div className="mt-12 p-6 md:p-8 border-l-4 border-[#FF3E00] bg-[#121212] border-y border-r border-white/10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h4 className="font-['Syne'] text-lg font-bold text-[#FF3E00] uppercase tracking-wider mb-2">
                  Chef's Note
                </h4>
                <p className="font-['Space_Grotesk'] text-sm md:text-base text-white/80 leading-relaxed italic">
                  "{recipe.chefNote.text}"
                </p>
                {recipe.chefNote.authorName && (
                  <p className="mt-4 font-mono text-xs uppercase text-[#FF3E00] font-bold tracking-widest">
                    — {recipe.chefNote.authorName}, {recipe.chefNote.authorTitle || 'Culinary Editor'}
                  </p>
                )}
              </div>

              {recipe.chefNote.avatarUrl && (
                <div className="w-20 h-20 overflow-hidden border-2 border-white/30 shrink-0">
                  <img
                    src={recipe.chefNote.avatarUrl}
                    alt={recipe.chefNote.authorName || 'Chef'}
                    className="w-full h-full object-cover filter grayscale contrast-150"
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Alternative Recipe Choices */}
      {recipesList && recipesList.length > 1 && (
        <div className="mt-16 pt-10 border-t border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em]">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>EXPLORE ALTERNATIVES</span>
              </div>
              <h3 className="font-['Syne'] text-2xl md:text-3xl font-black uppercase text-[#F5F5F5] tracking-tight">
                Alternative Culinary Paths
              </h3>
              <p className="font-['Space_Grotesk'] text-sm text-white/50 italic mt-1">
                We've crafted 3 alternative recipe ideas with the same ingredients. Tap any to switch.
              </p>
            </div>

            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="bg-transparent hover:bg-white/10 text-white hover:text-white font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 border border-white/20 hover:border-white transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                <span>Shuffle Ideas</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipesList.map((altRecipe, idx) => {
              // Skip the active recipe
              if (idx === activeRecipeIndex) return null;

              return (
                <button
                  key={altRecipe.id || idx}
                  type="button"
                  onClick={() => onSelectRecipeIndex?.(idx)}
                  className="text-left p-6 bg-[#121212] hover:bg-[#1a1a1a] border border-white/20 hover:border-[#FF3E00] transition-all group flex flex-col justify-between min-h-[220px] rounded-none cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-[#FF3E00] text-black text-[9px] uppercase font-black font-mono px-2 py-0.5 inline-block tracking-wider">
                        {altRecipe.tags?.[0] || 'Alternative'}
                      </span>
                      <span className="font-mono text-[10px] text-white/40 font-bold uppercase">
                        {altRecipe.prepTime}
                      </span>
                    </div>
                    <h4 className="font-['Syne'] text-lg font-bold text-white group-hover:text-[#FF3E00] transition-colors line-clamp-2">
                      {altRecipe.title}
                    </h4>
                    <p className="font-['Space_Grotesk'] text-xs text-white/60 line-clamp-3 leading-relaxed">
                      {altRecipe.tagline || altRecipe.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-mono font-bold text-white/50 w-full">
                    <span>{altRecipe.servings} Servings</span>
                    <span className="text-[#FF3E00] group-hover:translate-x-1 transition-transform">VIEW RECIPE →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
