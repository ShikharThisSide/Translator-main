import { createHmac, timingSafeEqual } from "node:crypto";

function sign(value) { return createHmac("sha256", process.env.OTP_SECRET || process.env.RESEND_API_KEY).update(value).digest("hex"); }
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const email = String(request.body?.email || "").trim().toLowerCase();
  const [payload, signature] = String(request.body?.token || "").split(".");
  let record;
  try { const expected = sign(payload); if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("Invalid signature"); record = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch { return response.status(400).json({ error: "That code is invalid or expired." }); }
  if (record.email !== email || record.expiresAt < Date.now() || record.code !== String(request.body?.otp || "").trim()) return response.status(400).json({ error: "That code is invalid or expired." });
  return response.status(200).json({ verified: true });
}
