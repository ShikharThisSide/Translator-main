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

function authApi() {
  const otpStore = new Map();
  return {
    name: "auth-api",
    configureServer(server) {
      for (const route of ["/api/auth/send-otp", "/api/auth/verify-otp"]) {
        server.middlewares.use(route, async (request, response) => {
          if (request.method !== "POST") { response.statusCode = 405; return response.end(JSON.stringify({ error: "Method not allowed." })); }
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          const email = String(body.email || "").trim().toLowerCase();
          response.setHeader("Content-Type", "application/json");
          if (route.endsWith("verify-otp")) {
            const record = otpStore.get(email);
            if (!record || record.expiresAt < Date.now() || record.code !== String(body.otp || "").trim()) { response.statusCode = 400; return response.end(JSON.stringify({ error: "That code is invalid or expired." })); }
            otpStore.delete(email); return response.end(JSON.stringify({ verified: true }));
          }
          if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) { response.statusCode = 500; return response.end(JSON.stringify({ error: "Email service is not configured locally. Add RESEND_API_KEY and FROM_EMAIL to .env." })); }
          const code = String(Math.floor(100000 + Math.random() * 900000));
          otpStore.set(email, { code, expiresAt: Date.now() + 600000 });
          const mail = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.FROM_EMAIL, to: [email], subject: "Your Translixor verification code", text: `Your Translixor verification code is ${code}. It expires in 10 minutes.` }) });
          if (!mail.ok) { const details = await mail.text(); let message = "Resend could not send the verification email."; try { message = JSON.parse(details).message || message; } catch {} response.statusCode = 502; return response.end(JSON.stringify({ error: `Resend: ${message}` })); }
          return response.end(JSON.stringify({ sent: true }));
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [translationApi(), authApi(), react()]
});
