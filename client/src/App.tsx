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

import { Recipe, IngredientItem, KitchenTimer } from './types';
import { SAMPLE_RECIPES } from './data/recipes';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'input' | 'recipe' | 'pantry' | 'recipes-browse' | 'timer' | 'shopping'
  >('recipe'); // Default to 'recipe' so user immediately sees the flagship Rustic Vegetable Frittata layout!

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastInputQuery, setLastInputQuery] = useState<string>('');

  const requestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Current displayed recipe (initializes with flagship Rustic Vegetable Frittata)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(SAMPLE_RECIPES[0]);

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

      if (!response.ok || !data.success || !data.recipe) {
        let errMsg = data.error || 'Unable to generate recipe with these ingredients.';
        if (data.error === 'bad_output') {
          errMsg = "Gemini had trouble parsing the recipe. The generated structure didn't fit our recipe book. Please try submitting again.";
        } else if (data.error === 'network') {
          errMsg = "We can't connect to our kitchen right now. Please check if the server is running and try again.";
        } else if (data.error === 'timeout') {
          errMsg = "Generating a recipe took too long (exceeded 20 seconds). Let's try again!";
        }
        throw new Error(errMsg);
      }

      const raw = data.recipe;

      // Transform API result into Recipe model
      const generatedRecipe: Recipe = {
        id: `recipe-gen-${Date.now()}`,
        title: raw.title || 'Artisanal Fridge Creation',
        tagline: raw.description || raw.tagline || 'A custom crafted dish made from your fridge staples.',
        prepTime: typeof raw.prepTime === 'number' ? `${raw.prepTime} min` : raw.prepTime || '20 min',
        tags: raw.tags || (tags.length > 0 ? tags : ['Fresh', '20 min']),
        servings: raw.servings || 2,
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
        imageAlt: raw.title,
        ingredients: (raw.ingredients || []).map((ing: any, i: number) => ({
          id: ing.id || `ing-gen-${i}-${Date.now()}`,
          name: ing.name,
          amount: typeof ing.amount === 'number' ? ing.amount : 1,
          unit: ing.unit || '',
          category: ing.category || 'pantry',
          optional: ing.optional || false,
        })),
        missingIngredients: raw.missingIngredients || [],
        steps: (raw.steps || []).map((st: any, i: number) => ({
          id: st.id || `step-gen-${i}-${Date.now()}`,
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

      setCurrentRecipe(generatedRecipe);
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
        setActiveTab={setActiveTab}
        activeTimersCount={activeTimersCount}
        shoppingListCount={shoppingList.length}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4">
        {/* Loading State */}
        {isLoading && <SkeletonRecipeView />}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <ErrorState
            errorMessage={errorMsg}
            onRetry={() => handleGenerateRecipe(lastInputQuery || 'eggs, spinach, onion', [])}
            onSelectSample={() => handleSelectSample('rustic-frittata')}
          />
        )}

        {/* Normal Views */}
        {!isLoading && !errorMsg && (
          <>
            {activeTab === 'input' && (
              <InputScreen
                onGenerate={handleGenerateRecipe}
                isLoading={isLoading}
                onSelectSampleRecipe={handleSelectSample}
              />
            )}

            {activeTab === 'recipe' && currentRecipe && (
              <RecipeView
                recipe={currentRecipe}
                onOpenSubstitution={(ing) => setSubTargetIngredient(ing)}
                onAddMissingToShoppingList={handleAddMissingToShoppingList}
                onStartTimer={handleStartTimer}
                onSaveRecipe={handleToggleSaveRecipe}
                isSaved={isCurrentSaved}
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
