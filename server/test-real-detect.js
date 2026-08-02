const fs = require('fs');
const path = require('path');

async function runRealTest() {
  console.log("==================================================");
  console.log("TEST: Vision Ingredient Detection with Real Image");
  console.log("==================================================");

  const imagePath = "C:\\Users\\Krish Maheshwari\\.gemini\\antigravity-ide\\brain\\cc50f697-4e91-439d-8fd7-44fe52e8ce4b\\rustic_vegetable_frittata_1785520098149.png";
  
  try {
    if (!fs.existsSync(imagePath)) {
      console.error("Image file does not exist at:", imagePath);
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mediaType = 'image/png';

    console.log("Sending base64 image (size:", (imageBuffer.length / 1024).toFixed(2), "KB) to API...");

    const res = await fetch("http://localhost:5000/api/detect-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Image,
        mediaType: mediaType
      })
    });

    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response JSON:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Real vision test failed:", err);
  }
}

runRealTest();
