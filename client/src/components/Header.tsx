import React from 'react';
import { Utensils, Refrigerator, Clock, ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping';
  setActiveTab: (tab: 'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping') => void;
  activeTimersCount?: number;
  shoppingListCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeTimersCount = 0,
  shoppingListCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-[#080808]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('input')}
          className="text-left group flex items-center gap-3 focus:outline-none"
        >
          <span className="font-['Syne',sans-serif] text-xl md:text-2xl font-black tracking-tighter italic uppercase text-[#F5F5F5] group-hover:text-[#FF3E00] transition-colors">
            THE LEFTOVERS<span className="text-[#FF3E00]">.</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold py-1 px-2.5 bg-white text-black rounded-xs">
            STUDIO
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center font-['Space_Grotesk',sans-serif] text-[11px] font-bold uppercase tracking-[0.2em]">
          <button
            onClick={() => setActiveTab('input')}
            className={`transition-colors py-1 ${
              activeTab === 'input'
                ? 'text-[#F5F5F5] border-b-2 border-[#FF3E00]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('pantry')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'pantry'
                ? 'text-[#F5F5F5] border-b-2 border-[#FF3E00]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Refrigerator className="w-4 h-4 stroke-[2]" />
            Pantry
          </button>
          <button
            onClick={() => setActiveTab('recipes-browse')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'recipes-browse' || activeTab === 'recipe'
                ? 'text-[#F5F5F5] border-b-2 border-[#FF3E00]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4 stroke-[2]" />
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`transition-colors py-1 flex items-center gap-1.5 relative ${
              activeTab === 'timer'
                ? 'text-[#F5F5F5] border-b-2 border-[#FF3E00]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 stroke-[2]" />
            Timer
            {activeTimersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`transition-colors py-1 flex items-center gap-1.5 relative ${
              activeTab === 'shopping'
                ? 'text-[#F5F5F5] border-b-2 border-[#FF3E00]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            List
            {shoppingListCount > 0 && (
              <span className="bg-[#FF3E00] text-black font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {shoppingListCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white/70 p-1.5 rounded hover:bg-white/10"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#080808] px-4 py-4 space-y-3 font-['Space_Grotesk'] text-xs uppercase tracking-[0.2em] font-bold">
          <button
            onClick={() => {
              setActiveTab('input');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 border-b border-white/10 text-white"
          >
            Fridge Input
          </button>
          <button
            onClick={() => {
              setActiveTab('pantry');
              setMobileMenuOpen(false);
            }}
            className="flex justify-between items-center w-full text-left py-2 border-b border-white/10 text-white"
          >
            <span>Pantry Inventory</span>
            <Refrigerator className="w-4 h-4 text-[#FF3E00]" />
          </button>
          <button
            onClick={() => {
              setActiveTab('recipes-browse');
              setMobileMenuOpen(false);
            }}
            className="flex justify-between items-center w-full text-left py-2 border-b border-white/10 text-white"
          >
            <span>Browse Recipes</span>
            <Utensils className="w-4 h-4 text-[#FF3E00]" />
          </button>
          <button
            onClick={() => {
              setActiveTab('timer');
              setMobileMenuOpen(false);
            }}
            className="flex justify-between items-center w-full text-left py-2 border-b border-white/10 text-white"
          >
            <span>Kitchen Timers</span>
            {activeTimersCount > 0 && <span className="bg-[#FF3E00] text-black px-2 py-0.5 text-[10px] rounded-full font-bold">{activeTimersCount} active</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab('shopping');
              setMobileMenuOpen(false);
            }}
            className="flex justify-between items-center w-full text-left py-2 text-white"
          >
            <span>Shopping List</span>
            {shoppingListCount > 0 && <span className="bg-[#FF3E00] text-black px-2 py-0.5 text-[10px] rounded-full font-bold">{shoppingListCount} items</span>}
          </button>
        </div>
      )}
    </header>
  );
};
