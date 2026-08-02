
const base64Image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // 1x1 transparent GIF

async function runTest() {
  console.log("==================================================");
  console.log("TEST: Vision Ingredient Detection");
  console.log("==================================================");

  try {
    const res = await fetch("http://localhost:5000/api/detect-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64Image,
        mediaType: "image/gif"
      })
    });

    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response JSON:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
