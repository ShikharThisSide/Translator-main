const otpStore = globalThis.__translixorOtpStore || (globalThis.__translixorOtpStore = new Map());
export default async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed." });
  const email = String(request.body?.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ error: "Enter a valid email address." });
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) return response.status(500).json({ error: "Email service is not configured yet." });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email, { code, expiresAt: Date.now() + 600000 });
  const mail = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.FROM_EMAIL, to: [email], subject: "Your Translixor verification code", text: `Your Translixor verification code is ${code}. It expires in 10 minutes.` }) });
  if (!mail.ok) {
    const details = await mail.text();
    let message = "Unable to send the verification email.";
    try { message = JSON.parse(details).message || message; } catch {}
    return response.status(502).json({ error: `Resend: ${message}` });
  }
  return response.status(200).json({ sent: true });
}
