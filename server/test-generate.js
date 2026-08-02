const fs = require('fs');

async function testGenerate() {
  console.log("==================================================");
  console.log("TEST: Recipe Generator with 4 Alternatives");
  console.log("==================================================");

  try {
    const res = await fetch("http://localhost:5000/api/generate-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients: "eggs, baby spinach, feta cheese, chicken breast, tomatoes",
        constraints: ["Quick (< 20 min)"]
      })
    });

    console.log("Status:", res.status);
    const json = await res.status === 200 ? await res.json() : null;
    
    if (json && json.success) {
      console.log("Success! Generated recipes count:", json.recipes.length);
      json.recipes.forEach((recipe, idx) => {
        console.log(`\n--- RECIPE #${idx + 1}: ${recipe.title} ---`);
        console.log(`Tagline: ${recipe.description}`);
        console.log(`Prep: ${recipe.prepTime} min, Cook: ${recipe.cookTime} min, Servings: ${recipe.servings}`);
        console.log(`Image URL: ${recipe.imageUrl}`);
        console.log(`Image Alt: ${recipe.imageAlt}`);
        console.log(`Ingredients (${recipe.ingredients.length}):`, recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join(", "));
        console.log(`Steps (${recipe.steps.length}):`, recipe.steps.map(s => `${s.stepNumber}. ${s.text.substring(0, 40)}...`).join(" | "));
      });
    } else {
      console.error("API returned error:", json);
    }
  } catch (err) {
    console.error("Recipe generation test failed:", err);
  }
}

testGenerate();
