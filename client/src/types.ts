export interface IngredientItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: 'produce' | 'dairy' | 'pantry' | 'protein' | 'spices';
  originalString?: string;
}

export interface RecipeStep {
  id: string;
  number: number;
  title: string;
  description: string;
  timerMinutes?: number;
}

export interface ChefNote {
  text: string;
  authorName?: string;
  authorTitle?: string;
  avatarUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  tagline: string;
  prepTime: string;
  tags: string[];
  servings: number;
  imageUrl: string;
  imageAlt?: string;
  ingredients: IngredientItem[];
  missingIngredients: string[];
  steps: RecipeStep[];
  chefNote?: ChefNote;
}

export interface KitchenTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface SubstitutionOption {
  original: string;
  substitutes: string[];
  reason: string;
}
