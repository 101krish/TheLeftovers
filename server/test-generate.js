// Native fetch is available globally in Node.js 18+

async function runTest(label, payload) {
  console.log(`\n==================================================`);
  console.log(`TEST: ${label}`);
  console.log(`PAYLOAD:`, JSON.stringify(payload));
  console.log(`==================================================`);

  try {
    const res = await fetch("http://localhost:5000/api/generate-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Response JSON:`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error executing fetch:`, err.message);
  }
}

async function runSwapTest(recipe, ingredientId) {
  console.log(`\n==================================================`);
  console.log(`TEST: Swap Ingredient (${ingredientId})`);
  console.log(`==================================================`);

  try {
    const res = await fetch("http://localhost:5000/api/swap-ingredient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipe, ingredientId })
    });

    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log(`Response JSON:`, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error executing swap fetch:`, err.message);
  }
}

async function start() {
  // Test 1: Empty ingredients list (should fail server-side fast validation)
  await runTest("Empty String", { ingredients: "" });

  // Test 2: Normal list of ingredients
  const successRecipe = await runTest("Normal Ingredients (spinach, eggs, bread)", { 
    ingredients: "spinach, eggs, bread" 
  });

  // Test 3: Edge Case - Single ingredient
  await runTest("Single Ingredient (only cheese)", { 
    ingredients: "only cheese" 
  });

  // Test 4: Edge Case - Non-food items
  await runTest("Non-food items (keyboard, mouse, screwdriver)", { 
    ingredients: "keyboard, mouse, screwdriver" 
  });
}

start();
