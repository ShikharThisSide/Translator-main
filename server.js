import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createOpenAIClient, translateWithAI } from "./lib/translate-response.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, "public");
const app = express();
const port = process.env.PORT || 3000;
const client = createOpenAIClient();

app.set("trust proxy", 1);
const requestCounts = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;

function translationRateLimit(request, response, next) {
  const key = request.ip || "unknown";
  const current = requestCounts.get(key) || { count: 0, startedAt: Date.now() };
  if (Date.now() - current.startedAt > RATE_WINDOW_MS) {
    current.count = 0;
    current.startedAt = Date.now();
  }
  current.count += 1;
  requestCounts.set(key, current);
  if (current.count > RATE_LIMIT) return response.status(429).json({ error: "Too many translation requests. Try again in a minute." });
  next();
}

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(publicDirectory));

app.post("/api/translate", translationRateLimit, async (request, response) => {
  try {
    const result = await translateWithAI({
      client,
      text: request.body?.text,
      targetLanguage: request.body?.targetLanguage,
      sourceType: request.body?.sourceType || "text"
    });
    response.json(result);
  } catch (error) {
    console.error("Translation error:", error);

    response.status(500).json({
      error:
        error?.message ||
        "The AI translation request failed. Please check your API key and try again."
    });
  }
});

app.get("*", (_request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

app.listen(port, () => {
  console.log(`AI translator running at http://localhost:${port}`);
});
