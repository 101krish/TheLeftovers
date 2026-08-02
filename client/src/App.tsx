import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputScreen } from './components/InputScreen';
import { SkeletonRecipeView } from './components/SkeletonRecipeView';
import { RecipeView } from './components/RecipeView';
import { SubstitutionModal } from './components/SubstitutionModal';
import { TimerDrawer } from './components/TimerDrawer';
import { PantryView } from './components/PantryView';
import { ShoppingListView } from './components/ShoppingListView';
import { BrowseRecipesView } from './components/BrowseRecipesView';
import { ErrorState } from './components/ErrorState';
import { MobileFooterNav } from './components/MobileFooterNav';
import { DetectedReview } from './components/DetectedReview';

import { Recipe, IngredientItem, KitchenTimer } from './types';
import { SAMPLE_RECIPES } from './data/recipes';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping'
  >('input'); // Default to 'input' so user opens the Create screen directly!

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastInputQuery, setLastInputQuery] = useState<string>('');

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Vision detection states
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectedIngredients, setDetectedIngredients] = useState<
    Array<{ name: string; confidence: 'high' | 'medium' | 'low' }> | null
  >(null);
  const [detectedImagePreview, setDetectedImagePreview] = useState<string | null>(null);
  const [isDetectionEmpty, setIsDetectionEmpty] = useState<boolean>(false);

  const detectionRequestIdRef = useRef<number>(0);
  const detectionAbortControllerRef = useRef<AbortController | null>(null);
  const lastPhotoRef = useRef<{ base64: string; mediaType: string; previewUrl: string } | null>(null);
  const errorContextRef = useRef<'generation' | 'detection'>('generation');

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (detectionAbortControllerRef.current) {
        detectionAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Current displayed recipe (initializes with flagship Rustic Vegetable Frittata)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(SAMPLE_RECIPES[0]);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number>(0);

  const handleSelectRecipeIndex = (index: number) => {
    if (index >= 0 && index < generatedRecipes.length) {
      setActiveRecipeIndex(index);
      setCurrentRecipe(generatedRecipes[index]);
    }
  };

  // Saved recipes list
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([SAMPLE_RECIPES[0]]);

  // Ingredient substitution modal target
  const [subTargetIngredient, setSubTargetIngredient] = useState<IngredientItem | null>(null);

  // Shopping list items
  const [shoppingList, setShoppingList] = useState<string[]>([
    'Extra virgin olive oil',
    'Sea salt & black pepper',
  ]);

  // Kitchen timers
  const [timers, setTimers] = useState<KitchenTimer[]>([
    {
      id: 'timer-frittata-1',
      label: 'Sautéing Red Onion',
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
    },
  ]);

  // Generate Recipe via API
  const handleGenerateRecipe = async (ingredientsText: string, tags: string[]) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLastInputQuery(ingredientsText);
    setActiveTab('recipe');

    // 1. Increment requestId
    const currentRequestId = ++requestIdRef.current;

    // 2. Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientsText, tags }),
        signal: abortControllerRef.current.signal,
      });

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      const data = await response.json();

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok || !data.success || !data.recipes || !Array.isArray(data.recipes) || data.recipes.length === 0) {
        let errMsg = data.error || 'Unable to generate recipes with these ingredients.';
        if (data.error === 'bad_output') {
          errMsg = "Gemini had trouble parsing the recipe. The generated structure didn't fit our recipe book. Please try submitting again.";
        } else if (data.error === 'network') {
          errMsg = "We can't connect to our kitchen right now. Please check if the server is running and try again.";
        } else if (data.error === 'timeout') {
          errMsg = "Generating a recipe took too long (exceeded 20 seconds). Let's try again!";
        }
        throw new Error(errMsg);
      }

      const getFoodImage = (title: string, tagsList: string[] = []): string => {
        const t = title.toLowerCase();
        const allTags = tagsList.map(tag => tag.toLowerCase());

        if (t.includes('pasta') || t.includes('noodle') || t.includes('spaghetti') || t.includes('macaroni') || t.includes('ramen')) {
          return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('pizza') || t.includes('bread') || t.includes('bake') || t.includes('toast') || t.includes('dough') || t.includes('bun')) {
          return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('salad') || t.includes('bowl') || allTags.includes('vegetarian') || allTags.includes('vegan') || t.includes('green')) {
          return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('steak') || t.includes('beef') || t.includes('rib') || t.includes('chicken') || t.includes('meat') || t.includes('pork') || t.includes('bacon') || t.includes('turkey')) {
          return 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('soup') || t.includes('stew') || t.includes('curry') || t.includes('sauce') || t.includes('chili') || t.includes('broth')) {
          return 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('cake') || t.includes('dessert') || t.includes('sweet') || t.includes('chocolate') || t.includes('cookie') || t.includes('fruit') || t.includes('pie')) {
          return 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop';
        }
        if (t.includes('egg') || t.includes('breakfast') || t.includes('frittata') || t.includes('omelet') || t.includes('scramble') || t.includes('quiche')) {
          return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop';
      };

      const rawRecipes = data.recipes;
      const parsedRecipes: Recipe[] = rawRecipes.map((raw: any, index: number) => {
        const recipeTags = raw.tags || (tags.length > 0 ? tags : ['Fresh', '20 min']);
        const imageUrl = getFoodImage(raw.title || '', recipeTags);

        return {
          id: `recipe-gen-${index}-${Date.now()}`,
          title: raw.title || 'Artisanal Fridge Creation',
          tagline: raw.description || raw.tagline || 'A custom crafted dish made from your fridge staples.',
          prepTime: typeof raw.prepTime === 'number' ? `${raw.prepTime} min` : raw.prepTime || '20 min',
          tags: raw.tags || (tags.length > 0 ? tags : ['Fresh', '20 min']),
          servings: raw.servings || 2,
          imageUrl,
          imageAlt: raw.imageAlt || raw.title || 'Artisanal Fridge Creation',
          ingredients: (raw.ingredients || []).map((ing: any, i: number) => ({
            id: ing.id || `ing-gen-${i}-${index}-${Date.now()}`,
            name: ing.name,
            amount: typeof ing.amount === 'number' ? ing.amount : 1,
            unit: ing.unit || '',
            category: ing.category || 'pantry',
            optional: ing.optional || false,
          })),
          missingIngredients: raw.missingIngredients || [],
          steps: (raw.steps || []).map((st: any, i: number) => ({
            id: st.id || `step-gen-${i}-${index}-${Date.now()}`,
            number: st.stepNumber || st.number || i + 1,
            title: `STEP 0${st.stepNumber || st.number || i + 1}`.toUpperCase(),
            description: st.text || st.description || '',
            timerMinutes: st.timerMinutes || undefined,
          })),
          chefNote: raw.chefNoteText
            ? {
                text: raw.chefNoteText,
                authorName: 'Chef Antoine',
                authorTitle: 'Culinary Editor',
                avatarUrl:
                  'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop',
              }
            : undefined,
        };
      });

      setGeneratedRecipes(parsedRecipes);
      setActiveRecipeIndex(0);
      setCurrentRecipe(parsedRecipes[0]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      console.error('Failed to generate recipe:', err);
      const isNetworkError = err.message?.includes('Failed to fetch') || err.message?.includes('network');
      const errorMsgText = isNetworkError
        ? "We can't connect to our kitchen right now. Please check if the server is running and try again."
        : err.message || 'Error communicating with recipe AI.';
      setErrorMsg(errorMsgText);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Cancel active vision detection
  const cancelDetection = () => {
    if (detectionAbortControllerRef.current) {
      detectionAbortControllerRef.current.abort();
      detectionAbortControllerRef.current = null;
    }
    setIsDetecting(false);
    setDetectedIngredients(null);
    setDetectedImagePreview(null);
    setIsDetectionEmpty(false);
  };

  // POST base64 image to vision detection endpoint
  const handleDetectIngredients = async (base64Image: string, mediaType: string, previewUrl: string) => {
    setIsDetecting(true);
    setErrorMsg(null);
    setIsDetectionEmpty(false);
    setDetectedIngredients(null);
    errorContextRef.current = 'detection';

    // Store for potential retries
    lastPhotoRef.current = { base64: base64Image, mediaType, previewUrl };

    const currentRequestId = ++detectionRequestIdRef.current;

    if (detectionAbortControllerRef.current) {
      detectionAbortControllerRef.current.abort();
    }
    detectionAbortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/detect-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, mediaType }),
        signal: detectionAbortControllerRef.current.signal,
      });

      if (currentRequestId !== detectionRequestIdRef.current) {
        return;
      }

      const data = await response.json();

      if (currentRequestId !== detectionRequestIdRef.current) {
        return;
      }

      if (!response.ok || !data.success) {
        let errMsg = data.error || 'Unable to scan ingredients from this photo.';
        if (data.error === 'bad_output') {
          errMsg = "Gemini Vision had trouble processing this image. Please try again with a clearer picture.";
        } else if (data.error === 'network') {
          errMsg = "We can't connect to our vision service. Please check if the server is running.";
        } else if (data.error === 'timeout') {
          errMsg = "Scanning the image took too long (exceeded 20 seconds). Please try again!";
        }
        throw new Error(errMsg);
      }

      const detected = data.ingredients || [];
      setDetectedImagePreview(previewUrl);

      if (detected.length === 0) {
        setIsDetectionEmpty(true);
      } else {
        setDetectedIngredients(detected);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      if (currentRequestId !== detectionRequestIdRef.current) {
        return;
      }

      console.error('Failed to detect ingredients:', err);
      const isNetworkError = err.message?.includes('Failed to fetch') || err.message?.includes('network');
      const errorMsgText = isNetworkError
        ? "We can't connect to our vision service. Please check if the server is running."
        : err.message || 'Error communicating with vision AI.';
      setErrorMsg(errorMsgText);
    } finally {
      if (currentRequestId === detectionRequestIdRef.current) {
        setIsDetecting(false);
      }
    }
  };

  // Recipe saving toggle
  const handleToggleSaveRecipe = (recipeToSave: Recipe) => {
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipeToSave.id);
    if (isAlreadySaved) {
      setSavedRecipes(savedRecipes.filter((r) => r.id !== recipeToSave.id));
    } else {
      setSavedRecipes([...savedRecipes, recipeToSave]);
    }
  };

  // Substitute ingredient
  const handleApplySubstitution = (ingredientId: string, newName: string) => {
    if (!currentRecipe) return;

    const updatedIngredients = currentRecipe.ingredients.map((ing) =>
      ing.id === ingredientId ? { ...ing, name: newName } : ing
    );

    setCurrentRecipe({
      ...currentRecipe,
      ingredients: updatedIngredients,
    });
  };

  // Shopping list addition
  const handleAddMissingToShoppingList = (itemsToAdd: string[]) => {
    const newUnique = itemsToAdd.filter((item) => !shoppingList.includes(item));
    if (newUnique.length > 0) {
      setShoppingList([...shoppingList, ...newUnique]);
    }
  };

  // Start step timer
  const handleStartTimer = (minutes: number, label: string) => {
    const newTimer: KitchenTimer = {
      id: `timer-${Date.now()}`,
      label,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      isRunning: true,
    };
    setTimers([newTimer, ...timers]);
    setActiveTab('timer');
  };

  // Handle sample recipe selection
  const handleSelectSample = (sampleId: string) => {
    const found = SAMPLE_RECIPES.find((r) => r.id === sampleId) || SAMPLE_RECIPES[0];
    setCurrentRecipe(found);
    setActiveTab('recipe');
    setErrorMsg(null);
  };

  const isCurrentSaved = savedRecipes.some((r) => r.id === currentRecipe?.id);
  const activeTimersCount = timers.filter((t) => t.isRunning).length;

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-['Space_Grotesk',sans-serif] relative pb-16 md:pb-0 overflow-x-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'input') {
            cancelDetection();
          }
          setActiveTab(tab);
        }}
        activeTimersCount={activeTimersCount}
        shoppingListCount={shoppingList.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Loading State */}
        {(isLoading || isDetecting) && <SkeletonRecipeView />}

        {/* Error State */}
        {!isLoading && !isDetecting && errorMsg && (
          <ErrorState
            errorMessage={errorMsg}
            onRetry={() => {
              if (errorContextRef.current === 'detection' && lastPhotoRef.current) {
                handleDetectIngredients(
                  lastPhotoRef.current.base64,
                  lastPhotoRef.current.mediaType,
                  lastPhotoRef.current.previewUrl
                );
              } else {
                handleGenerateRecipe(lastInputQuery || 'eggs, spinach, onion', []);
              }
            }}
            onSelectSample={() => {
              cancelDetection();
              handleSelectSample('rustic-frittata');
            }}
          />
        )}

        {/* Normal Views */}
        {!isLoading && !isDetecting && !errorMsg && (
          <>
            {activeTab === 'input' && (
              <>
                {isDetectionEmpty ? (
                  /* Empty Detection State View */
                  <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 font-['Space_Grotesk']">
                    <div className="w-16 h-16 bg-[#121212] border-2 border-[#FF3E00] flex items-center justify-center mx-auto text-[#FF3E00]">
                      <Refrigerator className="w-8 h-8 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <span className="font-mono text-xs uppercase text-[#FF3E00] tracking-[0.25em] font-bold">
                        SCAN NOTE
                      </span>
                      <h2 className="font-['Syne'] text-2xl md:text-3xl font-black uppercase tracking-tight text-[#F5F5F5]">
                        NO INGREDIENTS DETECTED
                      </h2>
                      <p className="font-['Space_Grotesk'] text-sm text-white/60 italic max-w-md mx-auto">
                        We couldn't spot any ingredients in that photo. Try a clearer shot, better lighting, or switch to typing them instead.
                      </p>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => setIsDetectionEmpty(false)}
                        className="w-full sm:w-auto bg-[#FF3E00] hover:bg-white text-black font-['Space_Grotesk'] text-xs font-black uppercase tracking-widest px-6 py-3.5 transition-colors cursor-pointer border-0"
                      >
                        Try Photo Again
                      </button>
                      <button
                        onClick={() => {
                          setIsDetectionEmpty(false);
                          cancelDetection();
                        }}
                        className="w-full sm:w-auto border border-white/20 bg-[#121212] hover:border-white text-[#F5F5F5] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest px-6 py-3.5 transition-colors cursor-pointer"
                      >
                        Type Ingredients Instead
                      </button>
                    </div>
                  </div>
                ) : detectedIngredients ? (
                  /* Review Screen (Step 2) */
                  <DetectedReview
                    ingredients={detectedIngredients}
                    imagePreview={detectedImagePreview}
                    onConfirm={(ingredientsString) => {
                      // Submit to existing recipe generation flow
                      handleGenerateRecipe(ingredientsString, []);
                      // Clear review state
                      setDetectedIngredients(null);
                      setDetectedImagePreview(null);
                    }}
                    onCancel={() => {
                      cancelDetection();
                    }}
                  />
                ) : (
                  /* Upload and Form Input Screen (Step 1) */
                  <InputScreen
                    onGenerate={handleGenerateRecipe}
                    isLoading={isLoading}
                    onSelectSampleRecipe={handleSelectSample}
                    onDetectIngredients={handleDetectIngredients}
                    isDetecting={isDetecting}
                  />
                )}
              </>
            )}

            {activeTab === 'recipe' && currentRecipe && (
              <RecipeView
                recipe={currentRecipe}
                onOpenSubstitution={(ing) => setSubTargetIngredient(ing)}
                onAddMissingToShoppingList={handleAddMissingToShoppingList}
                onStartTimer={handleStartTimer}
                onSaveRecipe={handleToggleSaveRecipe}
                isSaved={isCurrentSaved}
                recipesList={generatedRecipes}
                activeRecipeIndex={activeRecipeIndex}
                onSelectRecipeIndex={handleSelectRecipeIndex}
                onRegenerate={() => {
                  handleGenerateRecipe(lastInputQuery || 'eggs, spinach, onion', []);
                }}
              />
            )}

            {activeTab === 'pantry' && (
              <PantryView
                onCookWithPantry={(selectedItems) => {
                  handleGenerateRecipe(selectedItems.join(', '), []);
                }}
              />
            )}

            {activeTab === 'recipes-browse' && (
              <BrowseRecipesView
                savedRecipes={savedRecipes}
                onSelectRecipe={(r) => {
                  setCurrentRecipe(r);
                  setActiveTab('recipe');
                }}
              />
            )}

            {activeTab === 'timer' && (
              <TimerDrawer timers={timers} onUpdateTimers={setTimers} />
            )}

            {activeTab === 'shopping' && (
              <ShoppingListView
                shoppingItems={shoppingList}
                onUpdateItems={setShoppingList}
              />
            )}
          </>
        )}
      </main>

      {/* Substitution Dialog Modal */}
      {subTargetIngredient && (
        <SubstitutionModal
          ingredient={subTargetIngredient}
          onClose={() => setSubTargetIngredient(null)}
          onApplySubstitution={handleApplySubstitution}
        />
      )}

      {/* Mobile Footer Navigation */}
      <MobileFooterNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTimersCount={activeTimersCount}
        shoppingListCount={shoppingList.length}
      />

      {/* Signature Theme Glow Line */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF3E00] to-transparent opacity-70 pointer-events-none z-50"></div>
    </div>
  );
}
