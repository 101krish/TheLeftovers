import React from 'react';
import { RefreshCw, ChefHat, BookOpen } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onSelectSample: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onSelectSample,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 text-center space-y-6 font-['Space_Grotesk',sans-serif]">
      <div className="w-16 h-16 bg-[#121212] border-2 border-[#FF3E00] flex items-center justify-center mx-auto text-[#FF3E00]">
        <ChefHat className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs uppercase text-[#FF3E00] tracking-[0.25em] font-bold">
          KITCHEN NOTE
        </span>
        <h2 className="font-['Syne'] text-2xl md:text-4xl font-black uppercase tracking-tight text-[#F5F5F5]">
          WE COULDN'T CREATE THAT RECIPE
        </h2>
        <p className="font-['Space_Grotesk'] text-sm md:text-base text-white/60 italic max-w-md mx-auto">
          {errorMessage ||
            'The culinary AI service experienced a momentary pause. Let’s try again or view one of our classic kitchen recipes.'}
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto bg-[#FF3E00] hover:bg-white text-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest px-6 py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 stroke-[3]" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onSelectSample}
          className="w-full sm:w-auto border border-white/20 bg-[#121212] hover:border-white text-[#F5F5F5] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 stroke-[2]" />
          <span>Browse Classic Recipes</span>
        </button>
      </div>
    </div>
  );
};
