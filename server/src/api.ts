import "dotenv/config";
import { Router, Request, Response } from "express";
import { GoogleGenerativeAI, FunctionDeclarationSchemaType as Type, Schema } from "@google/generative-ai";
import { RecipeListResponseSchema, SwapResponseSchema, DetectIngredientsResponseSchema } from "./schema.js";

const router = Router();

// Initialize Gemini client using GEMINI_API_KEY from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Define Gemini JSON schema structures matching our Zod schemas
const RECIPE_GEMINI_SCHEMA: any = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy and clear recipe title" },
    description: { type: Type.STRING, description: "Brief description detailing the flavor profile and visual appeal of the dish" },
    servings: { type: Type.INTEGER, description: "Default number of servings" },
    prepTime: { type: Type.INTEGER, description: "Preparation time in minutes" },
    cookTime: { type: Type.INTEGER, description: "Cooking time in minutes" },
    ingredients: {
      type: Type.ARRAY,
      description: "List of ingredients needed for the recipe",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique identifier (e.g. ing-1, ing-2)" },
          name: { type: Type.STRING, description: "Name of the ingredient (e.g. fresh spinach)" },
          amount: { type: Type.NUMBER, description: "Numeric amount of the ingredient" },
          unit: { type: Type.STRING, description: "Unit of measurement (e.g. grams, cups, leaves, tbsp)" },
          optional: { type: Type.BOOLEAN, description: "Whether this ingredient is optional or non-critical to the base dish" }
        },
        required: ["id", "name", "amount", "unit", "optional"]
      }
    },
    steps: {
      type: Type.ARRAY,
      description: "List of cooking steps to prepare the recipe",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique identifier (e.g. step-1, step-2)" },
          stepNumber: { type: Type.INTEGER, description: "1-indexed chronologically sorted step number" },
          text: { type: Type.STRING, description: "Clear instructions for what to do in this cooking step" }
        },
        required: ["id", "stepNumber", "text"]
      }
    },
    tags: {
      type: Type.ARRAY,
      description: "Dietary or style tags (e.g. Keto, Quick & Easy, Vegetarian)",
      items: { type: Type.STRING }
    },
    missingIngredients: {
      type: Type.ARRAY,
      description: "Key ingredients that are required for this recipe but were NOT included in the user's input list",
      items: { type: Type.STRING }
    },
    imageUrl: {
      type: Type.STRING,
      description: "A real, high-quality, professional food photograph URL from Unsplash matching this recipe. Select a real Unsplash food photo ID from training data (e.g. photo-1546069901-ba9599a7e63c for salad, photo-1565299624946-b28f40a0ae38 for pizza). Format: https://images.unsplash.com/photo-<unsplash_id>?q=80&w=1200&auto=format&fit=crop"
    },
    imageAlt: {
      type: Type.STRING,
      description: "Descriptive alt text for the photo"
    },
    chefNoteText: {
      type: Type.STRING,
      description: "An optional chef note with tips, roasted substitutes or suggestions for cooking the dish"
    }
  },
  required: [
    "title",
    "description",
    "servings",
    "prepTime",
    "cookTime",
    "ingredients",
    "steps",
    "tags",
    "missingIngredients"
  ]
};

const RECIPE_LIST_GEMINI_SCHEMA: any = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      description: "Array of exactly 4 unique recipes. The first should be a direct match, and the other 3 should be creative alternative choices.",
      items: RECIPE_GEMINI_SCHEMA
    }
  },
  required: ["recipes"]
};

const SWAP_GEMINI_SCHEMA: any = {
  type: Type.OBJECT,
  properties: {
    substitutes: {
      type: Type.ARRAY,
      description: "2 to 3 names of alternative ingredients that can substitute the requested ingredient. Do NOT include quantities, amounts or instructions, just the names.",
      items: { type: Type.STRING }
    },
    reason: {
      type: Type.STRING,
      description: "A brief 1-sentence explanation of why these substitutes work for the dish."
    }
  },
  required: ["substitutes", "reason"]
};

const DETECT_GEMINI_SCHEMA: any = {
  type: Type.OBJECT,
  properties: {
    ingredients: {
      type: Type.ARRAY,
      description: "List of detected ingredients inside the image. If no food items or ingredients are visible in the image, return an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Single ingredient name in plain lowercase (e.g. egg, spinach, bacon, onion)."
          },
          confidence: {
            type: Type.STRING,
            description: "Confidence level of detection: 'high' (clearly visible), 'medium' (partially visible or likely), or 'low' (uncertain or guess)."
          }
        },
        required: ["name", "confidence"]
      }
    }
  },
  required: ["ingredients"]
};

// Helper function to race Gemini API call with a 20-second timeout
async function callGeminiWithTimeout<T>(
  apiCallPromise: Promise<T>
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("TIMEOUT_ERROR"));
    }, 45000); // 45-second timeout
  });

  try {
    const result = await Promise.race([apiCallPromise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

// POST /api/generate-recipe
router.post("/generate-recipe", async (req: Request, res: Response) => {
  const { ingredients, constraints } = req.body;

  if (!ingredients || typeof ingredients !== "string" || ingredients.trim() === "") {
    return res.status(400).json({ success: false, error: "bad_output" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_LIST_GEMINI_SCHEMA,
      },
    });

    const prompt = `You are a professional chef. Create exactly 4 unique recipes based on the list of available ingredients and constraints.
Available ingredients: ${ingredients}
Constraints: ${JSON.stringify(constraints || {})}

Ensure all descriptions, taglines, ingredient lists, and steps are extremely concise and brief to minimize response payload. 
For each recipe:
1. Suggest distinct culinary paths (e.g. one sauté/stir-fry, one soup/stew, one baked/roasted dish, one salad or breakfast-style dish) using the available ingredients.
2. Limit to at most 6 ingredients and 4 steps. Keep texts short, punchy, and clear.
3. Select a real food photo URL from Unsplash matching each recipe name (e.g. photo-1546069901-ba9599a7e63c, etc.) and supply it in "imageUrl".
4. Ensure all ingredient and step IDs are unique within each recipe.
5. List any critical missing ingredients needed to complete the dish.`;

    const apiCall = model.generateContent(prompt);
    const response = await callGeminiWithTimeout(apiCall);
    const text = response.response.text();

    if (!text) {
      console.error("Empty response text from Gemini");
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    const parsedJson = JSON.parse(text);

    // Validate structured response against Zod schema
    const parseResult = RecipeListResponseSchema.safeParse(parsedJson);
    if (!parseResult.success) {
      console.error("Zod validation failed for recipe list:", parseResult.error.format());
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    const recipesWithIds = parseResult.data.recipes.map((recipe: any, recipeIdx: number) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ing: any, ingIdx: number) => ({
        ...ing,
        id: ing.id || `ing-${recipeIdx}-${ingIdx}-${Date.now()}`
      })),
      steps: recipe.steps.map((step: any, stepIdx: number) => ({
        ...step,
        id: step.id || `step-${recipeIdx}-${stepIdx}-${Date.now()}`
      }))
    }));

    return res.status(200).json({
      success: true,
      recipes: recipesWithIds,
    });
  } catch (error: any) {
    console.error("Error generating recipe list:", error);
    if (error?.message === "TIMEOUT_ERROR") {
      return res.status(504).json({ success: false, error: "timeout" });
    }
    // Upstream network / API error
    return res.status(502).json({ success: false, error: "network" });
  }
});

// POST /api/swap-ingredient
router.post("/swap-ingredient", async (req: Request, res: Response) => {
  const { recipe, ingredientId, ingredient } = req.body;

  if (!ingredient && (!recipe || !ingredientId)) {
    return res.status(400).json({ success: false, error: "bad_output" });
  }

  try {
    let targetIngredientName = "";
    let contextPrompt = "";

    if (ingredient && typeof ingredient === "string") {
      targetIngredientName = ingredient;
      contextPrompt = `Suggest 3-4 excellent culinary substitutions for the ingredient "${targetIngredientName}".
Explain briefly why each substitute works in a recipe.`;
    } else {
      const targetIngredient = recipe.ingredients?.find((i: any) => i.id === ingredientId);
      if (!targetIngredient) {
        return res.status(400).json({ success: false, error: "bad_output" });
      }
      targetIngredientName = targetIngredient.name;
      contextPrompt = `You are a professional chef. Provide 2 or 3 common ingredient substitutes for the ingredient "${targetIngredientName}" (Amount: ${targetIngredient.amount} ${targetIngredient.unit}) in the context of the provided recipe. Do NOT suggest substitutes that are already in the recipe.
Recipe Title: ${recipe.title}
Recipe Description: ${recipe.description}
Other Ingredients in Recipe: ${recipe.ingredients?.map((i: any) => i.name).join(", ")}`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: SWAP_GEMINI_SCHEMA,
      },
    });

    const apiCall = model.generateContent(contextPrompt);
    const response = await callGeminiWithTimeout(apiCall);
    const text = response.response.text();

    if (!text) {
      console.error("Empty response text from Gemini");
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    const parsedJson = JSON.parse(text);

    // Validate structured response against Zod schema
    const parseResult = SwapResponseSchema.safeParse(parsedJson);
    if (!parseResult.success) {
      console.error("Zod validation failed for swaps:", parseResult.error.format());
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    return res.status(200).json({
      success: true,
      data: {
        substitutes: parseResult.data.substitutes,
        reason: parseResult.data.reason,
      },
    });
  } catch (error: any) {
    console.error("Error swapping ingredient:", error);
    if (error?.message === "TIMEOUT_ERROR") {
      return res.status(504).json({ success: false, error: "timeout" });
    }
    return res.status(502).json({ success: false, error: "network" });
  }
});

// POST /api/detect-ingredients
router.post("/detect-ingredients", async (req: Request, res: Response) => {
  const { image, mediaType } = req.body;

  if (!image || !mediaType) {
    return res.status(400).json({ success: false, error: "bad_output" });
  }

  // Reject oversized payloads (cap at 5MB)
  const byteLength = Buffer.byteLength(image, 'base64');
  const sizeInMB = byteLength / (1024 * 1024);
  if (sizeInMB > 5) {
    console.error("Payload size exceeds 5MB limit:", sizeInMB.toFixed(2), "MB");
    return res.status(413).json({ success: false, error: "bad_output" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: DETECT_GEMINI_SCHEMA,
      },
    });

    const imageParts = [
      {
        inlineData: {
          data: image,
          mimeType: mediaType
        }
      }
    ];

    const prompt = `You are a computer vision culinary AI. Analyze this image of kitchen ingredients or inside a refrigerator.
Detect all visible food ingredients, raw items, packaged items, or spices.
For each item, output its name (in lowercase) and your confidence level ('high', 'medium', or 'low').
If the image does not show any food items or ingredients, return an empty array for ingredients.`;

    const apiCall = model.generateContent([prompt, ...imageParts]);
    const response = await callGeminiWithTimeout(apiCall);
    const text = response.response.text();

    if (!text) {
      console.error("Empty response text from Gemini Vision");
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    const parsedJson = JSON.parse(text);

    // Validate structured response against Zod schema
    const parseResult = DetectIngredientsResponseSchema.safeParse(parsedJson);
    if (!parseResult.success) {
      console.error("Zod validation failed for detections:", parseResult.error.format());
      return res.status(400).json({ success: false, error: "bad_output" });
    }

    return res.status(200).json({
      success: true,
      ingredients: parseResult.data.ingredients,
    });
  } catch (error: any) {
    console.error("Error detecting ingredients:", error);
    if (error?.message === "TIMEOUT_ERROR") {
      return res.status(504).json({ success: false, error: "timeout" });
    }
    return res.status(502).json({ success: false, error: "network" });
  }
});

export default router;
