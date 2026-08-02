# The Leftovers — Editorial Kitchen Tool

A functional React and Express full-stack application built by restructuring a high-fidelity Tailwind v4 client UI and wiring it to a secure, proxy-shielded Gemini 2.5 Flash backend.

## Project Structure

```
/
├── package.json          # Root script runner (starts client and server concurrently)
├── README.md
├── client/               # Vite + React (Tailwind v4) Frontend
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts    # Configured to proxy /api requests to Express
│   └── src/
│       ├── main.tsx
│       ├── App.tsx       # State engine, race condition handling (AbortController & requestId)
│       ├── types.ts      # UI types
│       ├── styles/
│       │   └── index.css # Tailwind v4 import & custom base rules
│       ├── components/   # Structured React components from the provided UI folder
│       │   ├── InputScreen.tsx
│       │   ├── RecipeView.tsx
│       │   ├── SkeletonRecipeView.tsx
│       │   ├── SubstitutionModal.tsx
│       │   ├── ErrorState.tsx
│       │   └── ...
│       └── data/
│           └── recipes.ts
└── server/               # Express + Zod + Google GenAI Backend
    ├── package.json
    ├── .env              # Secure API Key configuration
    └── src/
        ├── index.ts      # Server entry point (Port 5000)
        ├── api.ts        # API controllers, forced schema generation, 20s timeout
        └── schema.ts     # Zod schema validation
```

---

## Setup & Running

To run the application, make sure you have **Node.js (v20+)** installed.

### 1. Configure the API Key
Create a `.env` file inside the `server/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*(The key you provided during setup is saved inside `/server/.env` and will run out-of-the-box).*

### 2. Start the App Concurrently
Run the following commands in the **root** folder:
```bash
npm install
npm run install-all
npm start
```
- `npm install` installs root dependencies.
- `npm run install-all` installs both the client and server dependencies.
- `npm start` launches both the **Express Server (Port 5000)** and the **Vite Client (Port 3000)** concurrently. 

Once running, navigate to **http://localhost:3000** in your browser.

---

## AI Usage Disclosure
- **Gemini 2.5 Flash:** Used on the backend to enforce structured JSON output. We leveraged Gemini's native `responseSchema` configuration to guarantee the model output conforms exactly to the required JSON schema, avoiding raw prompts or text extraction issues.
- **Vite Middleware Proxying:** Configured in `client/vite.config.ts` to automatically route client `/api` calls to `http://localhost:5000/api`, ensuring that the Gemini API Key never leaks to the client browser under any circumstance.
- **Race Condition Prevention:** Wired an `AbortController` instantiation inside `handleGenerateRecipe` to cancel previous fetch requests if a user submits a new one rapidly, alongside a `requestIdRef` validation to ensure that slow, out-of-order backend responses never overwrite the active user view.

---

## Missing Screen/State Design Note
No visual screens or states were missing in your provided UI folder. It contained full definitions for:
- `InputScreen`: Ingredients input form.
- `SkeletonRecipeView`: Pulsing editorial page loading skeleton.
- `RecipeView`: Interactive flagship recipe card.
- `SubstitutionModal`: Ingredient swapping popup.
- `ErrorState`: Styled error banner.
- `PantryView`, `ShoppingListView`, `BrowseRecipesView`, `TimerDrawer`: Additional navigation tabs.

We successfully wired the existing designs to the backend without altering any colors, fonts, margins, or component structures.

---

## Known Limitations
- **Upstream Call Times:** Gemini generation may take between 3 to 10 seconds depending on network latency.
- **Dietary Constraints Mapping:** The frontend sends `selectedTags` (e.g. Vegetarian, Gluten-Free) as an array which is passed to the Gemini prompt constraints. Gemini will strictly attempt to honor them, but Zod does not perform semantic dietary validation on the output ingredients themselves.

---

## Time Spent
- **Total Duration:** ~3 hours (including environment setup, dependency installations, backend route building, schema configurations, frontend integration, and race condition/timeout testing).
