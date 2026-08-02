import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
  optional: z.boolean(),
});

export const StepSchema = z.object({
  id: z.string(),
  stepNumber: z.number(),
  text: z.string(),
});

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  servings: z.number().int().positive(),
  prepTime: z.number().nonnegative(),
  cookTime: z.number().nonnegative(),
  ingredients: z.array(IngredientSchema),
  steps: z.array(StepSchema),
  tags: z.array(z.string()),
  missingIngredients: z.array(z.string()),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  chefNoteText: z.string().optional(),
});

export const RecipeListResponseSchema = z.object({
  recipes: z.array(RecipeSchema).min(4).max(4),
});

export const SwapResponseSchema = z.object({
  substitutes: z.array(z.string()).min(2).max(4),
  reason: z.string(),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type Step = z.infer<typeof StepSchema>;
export type SwapResponse = z.infer<typeof SwapResponseSchema>;

export const DetectIngredientsResponseSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    })
  ),
});

export type DetectIngredientsResponse = z.infer<typeof DetectIngredientsResponseSchema>;
