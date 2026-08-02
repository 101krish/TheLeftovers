import React from 'react';
import { Refrigerator, Utensils, Clock, ShoppingBag } from 'lucide-react';

interface MobileFooterNavProps {
  activeTab: 'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping';
  setActiveTab: (tab: 'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping') => void;
  activeTimersCount?: number;
  shoppingListCount?: number;
}

export const MobileFooterNav: React.FC<MobileFooterNavProps> = ({
  activeTab,
  setActiveTab,
  activeTimersCount = 0,
  shoppingListCount = 0,
}) => {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#080808] border-t border-white/20 flex justify-around items-center px-2 py-2 shadow-2xl">
      <button
        onClick={() => setActiveTab('pantry')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 transition-colors ${
          activeTab === 'pantry' ? 'text-[#FF3E00]' : 'text-white/60 hover:text-white'
        }`}
      >
        <Refrigerator className="w-5 h-5 stroke-[2]" />
        <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest mt-1">
          Pantry
        </span>
      </button>

      <button
        onClick={() => setActiveTab('recipes-browse')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 transition-colors ${
          activeTab === 'recipes-browse' || activeTab === 'recipe'
            ? 'text-[#FF3E00]'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Utensils className="w-5 h-5 stroke-[2]" />
        <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest mt-1">
          Recipes
        </span>
      </button>

      <button
        onClick={() => setActiveTab('timer')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 transition-colors relative ${
          activeTab === 'timer' ? 'text-[#FF3E00]' : 'text-white/60 hover:text-white'
        }`}
      >
        <Clock className="w-5 h-5 stroke-[2]" />
        <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest mt-1">
          Timer
        </span>
        {activeTimersCount > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
        )}
      </button>

      <button
        onClick={() => setActiveTab('shopping')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 transition-colors relative ${
          activeTab === 'shopping' ? 'text-[#FF3E00]' : 'text-white/60 hover:text-white'
        }`}
      >
        <ShoppingBag className="w-5 h-5 stroke-[2]" />
        <span className="font-['Space_Grotesk'] text-[10px] font-bold uppercase tracking-widest mt-1">
          List
        </span>
        {shoppingListCount > 0 && (
          <span className="absolute top-1 right-2 bg-[#FF3E00] text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold">
            {shoppingListCount}
          </span>
        )}
      </button>
    </footer>
  );
};
