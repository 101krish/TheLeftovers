import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  amount: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 1 : parsed;
  }),
  unit: z.string().default(""),
  optional: z.boolean().default(false),
});

export const StepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 1 : parsed;
  }),
  text: z.string(),
});

export const RecipeSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  servings: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return val;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 2 : parsed;
  }),
  prepTime: z.union([z.number(), z.string()]).default(15),
  cookTime: z.union([z.number(), z.string()]).default(15),
  ingredients: z.array(IngredientSchema),
  steps: z.array(StepSchema),
  tags: z.array(z.string()).default([]),
  missingIngredients: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  chefNoteText: z.string().optional(),
});

export const RecipeListResponseSchema = z.object({
  recipes: z.array(RecipeSchema),
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
