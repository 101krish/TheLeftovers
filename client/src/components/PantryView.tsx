import React, { useState } from 'react';
import { Refrigerator, Plus, Trash2, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PantryViewProps {
  onCookWithPantry: (selectedItems: string[]) => void;
}

interface PantryItem {
  id: string;
  name: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Pantry & Dry Goods' | 'Proteins & Spices';
  selected: boolean;
}

const DEFAULT_PANTRY: PantryItem[] = [
  { id: 'p1', name: 'Eggs', category: 'Dairy & Eggs', selected: true },
  { id: 'p2', name: 'Baby Spinach', category: 'Produce', selected: true },
  { id: 'p3', name: 'Feta Cheese', category: 'Dairy & Eggs', selected: true },
  { id: 'p4', name: 'Red Onion', category: 'Produce', selected: true },
  { id: 'p5', name: 'Smoked Paprika', category: 'Proteins & Spices', selected: true },
  { id: 'p6', name: 'Garlic Cloves', category: 'Produce', selected: true },
  { id: 'p7', name: 'Chickpeas (Canned)', category: 'Pantry & Dry Goods', selected: false },
  { id: 'p8', name: 'Crushed Tomatoes', category: 'Pantry & Dry Goods', selected: false },
  { id: 'p9', name: 'Cooked Rice', category: 'Pantry & Dry Goods', selected: false },
  { id: 'p10', name: 'Kale', category: 'Produce', selected: false },
  { id: 'p11', name: 'Soy Sauce', category: 'Pantry & Dry Goods', selected: false },
];

export const PantryView: React.FC<PantryViewProps> = ({ onCookWithPantry }) => {
  const [items, setItems] = useState<PantryItem[]>(DEFAULT_PANTRY);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PantryItem['category']>('Produce');

  const toggleItem = (id: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, selected: !it.selected } : it)));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: PantryItem = {
      id: `pantry-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      selected: true,
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const selectedCount = items.filter((it) => it.selected).length;

  const handleCookClick = () => {
    const selectedNames = items.filter((it) => it.selected).map((it) => it.name);
    if (selectedNames.length > 0) {
      onCookWithPantry(selectedNames);
    }
  };

  const categories: PantryItem['category'][] = [
    'Produce',
    'Dairy & Eggs',
    'Pantry & Dry Goods',
    'Proteins & Spices',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <Refrigerator className="w-4 h-4 stroke-[2.5]" />
            <span>KITCHEN INVENTORY</span>
          </div>
          <h1 className="font-['Syne'] text-3xl md:text-5xl font-black uppercase tracking-tight text-[#F5F5F5]">
            MY PANTRY & FRIDGE
          </h1>
          <p className="font-['Space_Grotesk'] text-sm text-white/60 italic mt-1">
            Check off ingredients you have in stock, then generate a fresh recipe tailored to your fridge.
          </p>
        </div>

        <button
          onClick={handleCookClick}
          disabled={selectedCount === 0}
          className="bg-[#FF3E00] hover:bg-white text-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-[0.2em] px-6 py-3.5 transition-colors flex items-center justify-center gap-2 disabled:opacity-30 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Cook with {selectedCount} Selected</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="bg-[#121212] p-4 border-2 border-white/20 rounded-none flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item (e.g. Scallions, Goat Cheese, Quinoa)"
          className="flex-1 bg-[#181818] border border-white/20 px-4 py-2.5 text-sm font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00]"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as PantryItem['category'])}
          className="bg-[#181818] border border-white/20 px-3 py-2.5 text-xs font-['Space_Grotesk'] uppercase font-bold text-[#F5F5F5]"
        >
          <option value="Produce">Produce</option>
          <option value="Dairy & Eggs">Dairy & Eggs</option>
          <option value="Pantry & Dry Goods">Pantry & Dry Goods</option>
          <option value="Proteins & Spices">Proteins & Spices</option>
        </select>
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="bg-[#FF3E00] hover:bg-white text-black text-xs font-['Space_Grotesk'] font-black uppercase tracking-widest px-5 py-2.5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>
      </form>

      {/* Inventory Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catItems = items.filter((it) => it.category === cat);
          return (
            <div key={cat} className="border border-white/20 bg-[#121212] p-5 space-y-3">
              <h3 className="font-['Syne'] text-lg font-bold uppercase text-[#F5F5F5] border-b border-white/10 pb-2 flex justify-between items-center">
                <span>{cat}</span>
                <span className="font-mono text-xs text-[#FF3E00] font-bold">
                  {catItems.filter((it) => it.selected).length}/{catItems.length}
                </span>
              </h3>

              {catItems.length === 0 ? (
                <p className="text-xs text-white/40 italic font-['Space_Grotesk']">No items in {cat}</p>
              ) : (
                <div className="space-y-2">
                  {catItems.map((it) => (
                    <div
                      key={it.id}
                      className={`flex justify-between items-center p-3 border transition-colors cursor-pointer ${
                        it.selected
                          ? 'bg-[#1a1a1a] border-[#FF3E00] text-[#F5F5F5]'
                          : 'bg-[#121212] border-white/10 text-white/50 hover:border-white/30'
                      }`}
                      onClick={() => toggleItem(it.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 border flex items-center justify-center ${
                            it.selected
                              ? 'bg-[#FF3E00] border-[#FF3E00] text-black'
                              : 'border-white/30 bg-[#181818]'
                          }`}
                        >
                          {it.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="font-['Space_Grotesk'] text-sm font-semibold">
                          {it.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(it.id);
                        }}
                        className="text-white/40 hover:text-[#FF3E00] p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
