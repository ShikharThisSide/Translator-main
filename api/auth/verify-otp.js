const otpStore = globalThis.__translixorOtpStore || (globalThis.__translixorOtpStore = new Map());
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const email = String(request.body?.email || "").trim().toLowerCase();
  const record = otpStore.get(email);
  if (!record || record.expiresAt < Date.now() || record.code !== String(request.body?.otp || "").trim()) return response.status(400).json({ error: "That code is invalid or expired." });
  otpStore.delete(email);
  return response.status(200).json({ verified: true });
}
