import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { createOpenAIClient, translateWithAI } from "./lib/translate-response.js";

dotenv.config();

function translationApi() {
  return {
    name: "translation-api",
    configureServer(server) {
      server.middlewares.use("/api/translate", async (request, response, next) => {
        if (request.method !== "POST") return next();

        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          const result = await translateWithAI({
            client: createOpenAIClient(),
            text: body.text,
            targetLanguage: body.targetLanguage,
            sourceType: body.sourceType || "text"
          });
          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(result));
        } catch (error) {
          response.statusCode = 500;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify({ error: error.message || "Translation failed." }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [translationApi(), react()]
});
