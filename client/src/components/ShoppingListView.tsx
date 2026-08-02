import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Check, Printer, Copy } from 'lucide-react';

interface ShoppingListViewProps {
  shoppingItems: string[];
  onUpdateItems: (items: string[]) => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  shoppingItems,
  onUpdateItems,
}) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [newItem, setNewItem] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  const toggleChecked = (item: string) => {
    setCheckedMap((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    if (!shoppingItems.includes(newItem.trim())) {
      onUpdateItems([...shoppingItems, newItem.trim()]);
    }
    setNewItem('');
  };

  const removeItem = (item: string) => {
    onUpdateItems(shoppingItems.filter((i) => i !== item));
  };

  const clearChecked = () => {
    const remaining = shoppingItems.filter((i) => !checkedMap[i]);
    onUpdateItems(remaining);
    setCheckedMap({});
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shoppingItems.join('\n'));
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 space-y-8 font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>GROCERY UTILITY</span>
          </div>
          <h1 className="font-['Syne'] text-3xl md:text-5xl font-black uppercase text-[#F5F5F5] tracking-tight">
            SHOPPING LIST
          </h1>
          <p className="font-['Space_Grotesk'] text-sm text-white/60 italic mt-1">
            Ingredients missing from your fridge saved for your next market run.
          </p>
        </div>

        {shoppingItems.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="p-2.5 border border-white/20 bg-[#121212] text-[#F5F5F5] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
              title="Copy list to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 border border-white/20 bg-[#121212] text-[#F5F5F5] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
              title="Print shopping list"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        )}
      </div>

      {copiedToast && (
        <div className="p-3 bg-[#FF3E00] text-black text-xs font-mono font-bold uppercase tracking-wider text-center">
          Shopping list copied to clipboard!
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="bg-[#121212] p-4 border-2 border-white/20 flex gap-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add extra item (e.g. Olive oil, Sourdough bread)"
          className="flex-1 bg-[#181818] border border-white/20 px-4 py-2.5 text-sm font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00]"
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="bg-[#FF3E00] hover:bg-white text-black text-xs font-['Space_Grotesk'] font-black uppercase tracking-widest px-5 py-2.5 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-30"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>
      </form>

      {/* List */}
      {shoppingItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/20 p-8 bg-[#121212]">
          <ShoppingBag className="w-8 h-8 text-[#FF3E00] mx-auto mb-3 stroke-[2]" />
          <p className="font-['Syne'] text-lg text-[#F5F5F5] font-bold uppercase">
            Your shopping list is empty!
          </p>
          <p className="font-['Space_Grotesk'] text-xs text-white/50 mt-1">
            When recipes call for missing pantry staples, tap "Add to List" to save them here.
          </p>
        </div>
      ) : (
        <div className="bg-[#121212] border border-white/20 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="font-mono text-xs uppercase font-bold text-white/50">
              {shoppingItems.length} Items Total
            </span>
            <button
              onClick={clearChecked}
              className="text-xs font-mono uppercase font-bold text-[#FF3E00] hover:underline"
            >
              Clear Checked
            </button>
          </div>

          <div className="space-y-2">
            {shoppingItems.map((item) => {
              const isChecked = !!checkedMap[item];
              return (
                <div
                  key={item}
                  onClick={() => toggleChecked(item)}
                  className={`flex justify-between items-center p-3 border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#181818] border-white/10 text-white/30 line-through'
                      : 'bg-[#121212] border-white/20 text-[#F5F5F5] hover:border-[#FF3E00]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 border flex items-center justify-center ${
                        isChecked
                          ? 'bg-[#FF3E00] border-[#FF3E00] text-black'
                          : 'border-white/30 bg-[#181818]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="font-['Space_Grotesk'] text-base font-semibold">
                      {item}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                    className="text-white/40 hover:text-[#FF3E00] p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
