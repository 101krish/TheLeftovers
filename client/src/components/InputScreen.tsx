import React, { useState } from 'react';
import { Sparkles, ArrowRight, Refrigerator, ChefHat, Check, Camera, Upload, RefreshCw } from 'lucide-react';

interface InputScreenProps {
  onGenerate: (ingredients: string, tags: string[]) => void;
  isLoading: boolean;
  onSelectSampleRecipe: (recipeId: string) => void;
  onDetectIngredients: (base64Image: string, mediaType: string, previewUrl: string) => void;
  isDetecting: boolean;
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
  onDetectIngredients,
  isDetecting,
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'photo'>('text');
  const [ingredientsText, setIngredientsText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompilingImage, setIsCompilingImage] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

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

  const compressAndResizeImage = (file: File): Promise<{ base64: string; mediaType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress as JPEG at 80% quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          const parts = compressedBase64.split(',');
          const mediaType = parts[0].split(';')[0].split(':')[1] || 'image/jpeg';
          const base64Data = parts[1];

          resolve({ base64: base64Data, mediaType });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setIsCompilingImage(true);
    setSelectedFile(file);

    // Create a local object URL for preview instantly
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsCompilingImage(false);
  };

  const handleStartDetection = async () => {
    if (!selectedFile) return;

    setIsCompilingImage(true);
    setPhotoError(null);

    try {
      if (selectedFile.size > 10 * 1024 * 1024) {
        throw new Error("Image file is too large. Please select a photo smaller than 10MB.");
      }
      const { base64, mediaType } = await compressAndResizeImage(selectedFile);
      onDetectIngredients(base64, mediaType, imagePreview || '');
    } catch (err: any) {
      console.error("Image processing error:", err);
      setPhotoError(err.message || "Failed to process image. Please try again.");
    } finally {
      setIsCompilingImage(false);
    }
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPhotoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'text') {
      if (!ingredientsText.trim()) return;
      onGenerate(ingredientsText, selectedTags);
    } else {
      handleStartDetection();
    }
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

      {/* Input Mode Tabs */}
      <div className="flex border-b border-white/10 mb-8 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em]">
        <button
          type="button"
          onClick={() => {
            setInputMode('text');
            setPhotoError(null);
          }}
          className={`py-3 px-6 border-b-2 transition-colors cursor-pointer ${
            inputMode === 'text'
              ? 'border-[#FF3E00] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          Text Input
        </button>
        <button
          type="button"
          onClick={() => setInputMode('photo')}
          className={`py-3 px-6 border-b-2 transition-colors cursor-pointer ${
            inputMode === 'photo'
              ? 'border-[#FF3E00] text-white'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          Photo Scan
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {inputMode === 'text' ? (
          /* Ingredient Textarea Input Mode */
          <div className="space-y-8">
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
      </div>
    ) : (
      /* Photo Scan Input Mode */
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="block font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Scan Fridge Ingredients
          </span>
          
          {!imagePreview ? (
            /* Empty Upload Dropzone */
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-[#FF3E00] p-10 bg-[#121212] transition-colors relative group min-h-[220px]">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading || isDetecting}
              />
              <Camera className="w-10 h-10 text-[#FF3E00] mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-['Space_Grotesk'] text-sm font-bold text-white/95">
                Take photo or select an image
              </span>
              <span className="font-['Space_Grotesk'] text-xs text-white/40 mt-1">
                Supports JPG, PNG, WEBP (Maximum 10MB)
              </span>
            </div>
          ) : (
            /* Photo Selected & Preview */
            <div className="border border-white/20 bg-[#121212] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-36 h-36 bg-[#181818] overflow-hidden border border-white/10 shrink-0 aspect-square">
                <img src={imagePreview} alt="Captured ingredients preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-3 w-full text-center md:text-left">
                <p className="font-['Space_Grotesk'] text-sm font-bold text-white uppercase tracking-wider truncate max-w-md">
                  {selectedFile?.name || 'Staples Capture'}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={handleStartDetection}
                    disabled={isCompilingImage || isDetecting}
                    className="bg-[#FF3E00] hover:bg-white text-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest px-5 py-3 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {(isCompilingImage || isDetecting) ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 stroke-[2]" />
                        <span>Detect Ingredients</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    disabled={isCompilingImage || isDetecting}
                    className="border border-white/20 hover:border-white text-white/80 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors bg-transparent cursor-pointer disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message for Photo Mode */}
        {photoError && (
          <div className="p-4 bg-[#FF3E00]/10 border-l-4 border-[#FF3E00] text-xs font-mono text-[#FF3E00]/90">
            {photoError}
          </div>
        )}
      </div>
    )}
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
