import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./api.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors({
  origin: "*", // In production we would restrict this, but for local testing * is suitable.
}));

app.use(express.json());

// Register API routes
app.use("/api", apiRouter);

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
