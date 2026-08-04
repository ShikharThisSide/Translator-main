import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowLeftRight, Check, Copy, Download, FileText, Heart, Link2, Mic, Volume2, Image as ImageIcon, Languages, RefreshCw, Share2, Sparkles, Trash2, ClipboardPaste, WandSparkles, Upload, Settings, History, Star, ScanLine, PenLine, BookOpen, Globe2, Camera, Headphones, X } from "lucide-react";
import React from "react";
import "./styles.css";
import "./login-polish.css";
import "./features-polish.css";

const EASE = [0.16, 1, 0.3, 1];

function Footer() {
  return <motion.footer className="footer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}><div className="footer-left"><motion.div className="subtitle" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }}><i />AI-powered language intelligence</motion.div><motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }}>Translate anything.<br />Understand everyone.</motion.h1><motion.div className="actions" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8, ease: EASE }}><a className="button primary" href="/translator">Start translating</a><a className="button secondary" href="/features">Explore features</a></motion.div></div><a className="scroll-cue" href="/#universe"><span>Explore the model</span><b>↓</b></a></motion.footer>;
}

function TopNav() {
  const [account, setAccount] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem("translixor-auth") || "null"); } catch { return null; } });
  const logout = () => { window.localStorage.removeItem("translixor-auth"); setAccount(null); window.location.href = "/"; };
  return <motion.header className="top-nav" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}><a className="nav-logo" href="/" aria-label="Home"><span className="logo-t">T</span></a><nav><a href="/translator">Translator</a><a href="/features">Features</a><a href="/#universe">About</a>{account ? <span className="account-nav"><a href="/translator" className="account-name" title={account.email}>{account.email?.split("@")[0] || "Account"}</a><button type="button" onClick={logout}>Log out</button></span> : <a href="/login">Login</a>}</nav></motion.header>;
}

const FEAT_FLOAT_WORDS = [
  { text: "Bonjour", top: "18%", left: "4%", dur: "13s", delay: "0s", tx: "20px", ty: "-18px" },
  { text: "Hola", top: "32%", left: "88%", dur: "11s", delay: "-2s", tx: "-18px", ty: "-24px" },
  { text: "नमस्ते", top: "72%", left: "6%", dur: "15s", delay: "-4s", tx: "14px", ty: "16px" },
  { text: "你好", top: "82%", left: "82%", dur: "12s", delay: "-1s", tx: "-12px", ty: "-10px" },
];

const FEAT_MARQUEE = ["English", "Hindi", "Spanish", "French", "Japanese", "Arabic", "Portuguese", "Korean", "German", "Chinese", "Italian", "Russian"];

const FEAT_MORPH_PAIRS = [
  ["Hello", "Bonjour"],
  ["Travel", "Viajar"],
  ["Connect", "つながる"],
];

function FeaturesAmbient() {
  return (
    <div className="features-ambient" aria-hidden="true">
      {FEAT_FLOAT_WORDS.map((w) => (
        <span key={w.text} className="feat-float-word" style={{ top: w.top, left: w.left, "--dur": w.dur, "--delay": w.delay, "--tx": w.tx, "--ty": w.ty }}>{w.text}</span>
      ))}
      {[22, 48, 74].map((top, i) => (
        <div key={i} className="feat-mesh-line" style={{ top: `${top}%`, left: `${10 + i * 12}%`, width: `${30 + i * 10}%`, animationDelay: `${i * 2.2}s` }} />
      ))}
    </div>
  );
}

function FeatureStoryCard({ className, children, delay = 0 }) {
  return (
    <motion.article
      className={`story-card ${className}`}
      initial={{ opacity: 0, y: 70, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.article>
  );
}

function Details() {
  const authenticated = Boolean(window.localStorage.getItem("translixor-auth"));
  const [morphIdx, setMorphIdx] = React.useState(0);
  const [morphFlip, setMorphFlip] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => setMorphFlip((v) => !v), 2600);
    return () => clearInterval(id);
  }, []);
  React.useEffect(() => {
    const id = setInterval(() => setMorphIdx((i) => (i + 1) % FEAT_MORPH_PAIRS.length), 5200);
    return () => clearInterval(id);
  }, []);
  const openFeature = () => { window.location.href = authenticated ? "/translator" : "/login?redirect=/translator"; };
  const capabilities = [
    ["01", "Text intelligence", "Translate Hinglish, slang, and nuanced sentences with context-aware output."],
    ["02", "Voice interface", "Speak naturally with voice input and listen to translations aloud."],
    ["03", "Visual context", "Turn screenshots and images into understandable translated text."],
    ["04", "Document translation", "Upload PDFs and keep longer documents moving with their meaning intact."],
    ["05", "Smart writing", "Polish grammar, tone, and clarity before you send a message."],
    ["06", "Language workspace", "Save, copy, download, share, and re-translate from one focused workspace."],
  ];
  const [from, to] = FEAT_MORPH_PAIRS[morphIdx];
  return (
    <section className="features-scroll-page">
      <FeaturesAmbient />
      <div className="feat-marquee-wrap" aria-hidden="true">
        <div className="feat-marquee-track">
          {[...FEAT_MARQUEE, ...FEAT_MARQUEE].map((lang, i) => <span key={`${lang}-${i}`}>{lang}</span>)}
        </div>
      </div>
      <motion.div className="features-intro" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
        <span className="feature-index"><span className="feat-index-dot" /> 01 / TRANSLIXOR FEATURES</span>
        <h1>Language,<br /><em>in motion.</em></h1>
        <p>Scroll through the workspace and see how Translixor turns everyday language into clear, human conversation.</p>
        <div className="feat-live-translate">
          <small>Live translate</small>
          <motion.b key={`${morphIdx}-${morphFlip}`} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.4 }}>{morphFlip ? to : from}</motion.b>
          <i>→</i>
          <motion.b key={`${morphIdx}-${morphFlip}-b`} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.4, delay: 0.1 }}>{morphFlip ? from : to}</motion.b>
        </div>
      </motion.div>
      <div className="feature-track" aria-label="Translixor capabilities">
        <FeatureStoryCard className="story-card-green" delay={0.1}>
          <div className="story-card-copy">
            <span>02 / IMAGE UPLOAD</span>
            <h2>See the words.<br /><em>Understand more.</em></h2>
            <p>Upload a photo, scan a document, or use your camera to extract and translate the text inside.</p>
            <button type="button" onClick={openFeature}>Try image translation <span>↗</span></button>
          </div>
          <div className="story-orbit"><b>Camera</b><b>OCR</b><b>Translate</b><i>meaning<br />preserved</i></div>
        </FeatureStoryCard>
        <FeatureStoryCard className="story-card-phone" delay={0.2}>
          <div className="story-card-copy">
            <span>01 / ASK ANYTHING</span>
            <h2>Understand your words.<br /><em>Even when they change.</em></h2>
            <p>Type naturally, mix Hinglish with English, and get a translation that preserves what you meant—not just what you wrote.</p>
            <button type="button" onClick={openFeature}>{authenticated ? "Open translator" : "Try the workspace"} <span>↗</span></button>
          </div>
          <motion.img src="/translator-phone-reference.png" alt="Translixor translation workspace shown on a phone" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3, ease: EASE }} />
        </FeatureStoryCard>
        <FeatureStoryCard className="story-card-dark" delay={0.3}>
          <div className="story-card-copy">
            <span>03 / SEE THE CONTEXT</span>
            <h2>From image to<br /><em>understanding.</em></h2>
            <p>Upload a screenshot, scan a document, or bring a PDF. Translixor extracts the words and carries their context forward.</p>
            <button type="button" onClick={openFeature}>Use visual translation <span>↗</span></button>
          </div>
          <motion.div className="story-file-stack" initial={{ opacity: 0, rotate: -14, x: 30 }} whileInView={{ opacity: 1, rotate: -8, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }}>
            <span>image.png</span><span>document.pdf</span><span>translated.txt</span>
          </motion.div>
        </FeatureStoryCard>
      </div>
      <div className="feat-capabilities">
        <motion.div className="feat-capabilities-head" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }}>
          <span>04 / FULL CAPABILITY SET</span>
          <h3>Everything language needs.</h3>
        </motion.div>
        <div className="feat-cap-grid">
          {capabilities.map(([num, title, copy], i) => (
            <motion.button
              key={num}
              type="button"
              className="feat-cap-tile"
              onClick={openFeature}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -6 }}
            >
              <b>{num}</b>
              <h4>{title}</h4>
              <p>{copy}</p>
              <span className="feat-cap-arrow">↗</span>
            </motion.button>
          ))}
        </div>
      </div>
      <motion.div className="features-followup" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.85, ease: EASE }}>
        <span>05 / READY WHEN YOU ARE</span>
        <h2>One workspace.<br /><em>Every conversation.</em></h2>
        <p>Translation should help people move closer, not make them stop and think about language.</p>
        <button type="button" onClick={openFeature}>{authenticated ? "Open workspace" : "Start translating"} <span>↗</span></button>
        <div className="feat-cta-wave" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ height: `${14 + (i % 4) * 10}px`, "--i": i }} />)}
        </div>
      </motion.div>
    </section>
  );
}

const AUTH_SLIDES = [
  { kicker: "TRANSLIXOR · LANGUAGE, UNDERSTOOD", headline: <>Turn every<br /><em>conversation</em><br />into connection.</>, from: "Hello", to: "Bonjour" },
  { kicker: "VOICE · TEXT · VISION", headline: <>Speak in one tongue.<br /><em>Be heard</em><br />in every language.</>, from: "नमस्ते", to: "Hello" },
  { kicker: "CONTEXT · MEANING · CLARITY", headline: <>Words that travel.<br /><em>Meaning</em><br />that stays.</>, from: "こんにちは", to: "Hola" },
];

const AUTH_FLOAT_WORDS = [
  { text: "Bonjour", top: "12%", left: "8%", dur: "11s", delay: "0s", tx: "18px", ty: "-24px" },
  { text: "Hola", top: "22%", left: "72%", dur: "13s", delay: "-2s", tx: "-22px", ty: "-18px" },
  { text: "नमस्ते", top: "58%", left: "6%", dur: "10s", delay: "-4s", tx: "14px", ty: "20px" },
  { text: "Ciao", top: "68%", left: "78%", dur: "12s", delay: "-1s", tx: "-16px", ty: "12px" },
  { text: "مرحبا", top: "38%", left: "88%", dur: "14s", delay: "-3s", tx: "-20px", ty: "-28px" },
  { text: "你好", top: "78%", left: "42%", dur: "9s", delay: "-5s", tx: "10px", ty: "-14px" },
];

const AUTH_ORBIT_NODES = [
  { label: "EN", angle: 0 },
  { label: "FR", angle: 60 },
  { label: "ES", angle: 120 },
  { label: "HI", angle: 180 },
  { label: "JA", angle: 240 },
  { label: "AR", angle: 300 },
];

function AuthAmbient() {
  return (
    <div className="auth-ambient" aria-hidden="true">
      {[18, 42, 68, 85].map((top, i) => (
        <div key={i} className="auth-mesh-line" style={{ top: `${top}%`, left: `${5 + i * 8}%`, width: `${28 + i * 12}%`, animationDelay: `${i * 1.8}s` }} />
      ))}
    </div>
  );
}

function AuthVisualPanel({ slideIndex, setSlideIndex }) {
  const slide = AUTH_SLIDES[slideIndex];
  const [morphOn, setMorphOn] = React.useState(false);
  const parallaxX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const parallaxY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    parallaxX.set(x);
    parallaxY.set(y);
  };
  const onLeave = () => { parallaxX.set(0); parallaxY.set(0); };
  React.useEffect(() => {
    const id = setInterval(() => setMorphOn((v) => !v), 2800);
    return () => clearInterval(id);
  }, [slideIndex]);
  React.useEffect(() => {
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % AUTH_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [setSlideIndex]);
  return (
    <motion.div className="auth-visual" onPointerMove={onMove} onPointerLeave={onLeave} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE }}>
      <div className="auth-visual-top">
        <motion.a className="auth-logo" href="/" whileHover={{ scale: 1.06, rotate: -2 }} whileTap={{ scale: 0.96 }}>T</motion.a>
        <motion.a className="auth-back" href="/" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Back to website <span>→</span></motion.a>
      </div>
      <div className="auth-float-layer">
        {AUTH_FLOAT_WORDS.map((w) => (
          <span key={w.text} className="auth-float-word" style={{ top: w.top, left: w.left, "--dur": w.dur, "--delay": w.delay, "--tx": w.tx, "--ty": w.ty }}>{w.text}</span>
        ))}
      </div>
      <motion.div className="auth-orbit-scene" style={{ x: parallaxX, y: parallaxY }}>
        <div className="auth-orbit-ring" />
        <div className="auth-orbit-ring" />
        <div className="auth-orbit-ring" />
        <div className="auth-orbit-core" />
        <motion.div className="auth-orbit-track" animate={{ rotate: 360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}>
          {AUTH_ORBIT_NODES.map(({ label, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 170;
            const y = Math.sin(rad) * 170;
            return (
              <motion.span key={label} className="auth-lang-node" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }} animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}>{label}</motion.span>
            );
          })}
        </motion.div>
      </motion.div>
      <div className="auth-waveform" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ height: `${12 + (i % 5) * 8}px`, "--i": i }} />)}
      </div>
      <div className="auth-visual-copy">
        <motion.small key={slide.kicker} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{slide.kicker}</motion.small>
        <motion.h1 key={slideIndex} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>{slide.headline}</motion.h1>
        <div className="auth-morph-line">
          <span className="auth-morph-label">Live translate</span>
          <motion.span className="auth-morph-word" key={`${slideIndex}-${morphOn}`} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>{morphOn ? slide.to : slide.from}</motion.span>
          <span className="auth-morph-arrow">→</span>
          <motion.span className="auth-morph-word" key={`${slideIndex}-${morphOn}-b`} initial={{ opacity: 0, y: 10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.45, delay: 0.12 }}>{morphOn ? slide.from : slide.to}</motion.span>
        </div>
        <div className="auth-dots">
          {AUTH_SLIDES.map((_, i) => (
            <i key={i} className={i === slideIndex ? "active" : ""} onClick={() => setSlideIndex(i)} role="button" tabIndex={0} aria-label={`Slide ${i + 1}`} onKeyDown={(e) => e.key === "Enter" && setSlideIndex(i)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AuthPage() {
  const [mode, setMode] = React.useState("signup");
  const [email, setEmail] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpToken, setOtpToken] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [statusError, setStatusError] = React.useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    setStatusError(false);
    try {
      const endpoint = otpSent ? "/api/auth/verify-otp" : "/api/auth/send-otp";
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, token: otpToken }) });
      const raw = await response.text();
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: "The authentication service returned an invalid response." }; }
      if (!response.ok) throw new Error(data.error || "Unable to continue.");
      if (!otpSent) {
        setOtpToken(data.token || "");
        setOtpSent(true);
        setStatus("We sent a 6-digit code to your email.");
      } else {
        window.localStorage.setItem("translixor-auth", JSON.stringify({ email }));
        window.location.href = new URLSearchParams(window.location.search).get("redirect") || "/";
      }
    } catch (error) {
      setStatusError(true);
      setStatus(error.message);
    }
  };
  const formTitle = otpSent ? "Verify your email" : mode === "signup" ? "Create an account" : "Welcome back";
  return (
    <main className="auth-page">
      <AuthAmbient />
      <motion.div className="auth-shell" initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.85, ease: EASE }}>
        <AuthVisualPanel slideIndex={slideIndex} setSlideIndex={setSlideIndex} />
        <motion.div className="auth-form-wrap" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
          <div className="auth-form">
            <motion.p className="auth-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="auth-kicker-dot" /> TEXT · VOICE · VISION
            </motion.p>
            <motion.h2 key={formTitle} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{formTitle}</motion.h2>
            <motion.p className="auth-switch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              {otpSent ? `Enter the code sent to ${email}` : mode === "signup" ? "Already have an account?" : "Need an account?"}
              {!otpSent && <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setStatus(""); }}>{mode === "signup" ? "Log in" : "Create one"}</button>}
            </motion.p>
            <form onSubmit={submit}>
              {!otpSent && mode === "signup" && (
                <motion.div className="auth-field" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}><input placeholder="Your name" required /></motion.div>
              )}
              <motion.div className="auth-field" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={otpSent} />
              </motion.div>
              {!otpSent && (
                <motion.div className="auth-field" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <input type="password" placeholder="Enter your password" required />
                </motion.div>
              )}
              {otpSent && (
                <motion.div className="auth-field" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                  <input inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit code" required autoFocus />
                </motion.div>
              )}
              {!otpSent && (
                <motion.label className="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  <input type="checkbox" required /> <span>I agree to the <u>Terms & Conditions</u></span>
                </motion.label>
              )}
              <motion.button className="auth-submit" type="submit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                {otpSent ? "Verify code" : mode === "signup" ? "Create account" : "Log in"} <span>→</span>
              </motion.button>
              {status && <motion.small className={`auth-status${statusError ? " error" : ""}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{status}</motion.small>}
            </form>
            <motion.div className="auth-feature-pills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
              <span>🌐 40+ languages</span>
              <span>🎙 Voice input</span>
              <span>📷 Image OCR</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

function TranslatorPage() {
  const [text, setText] = React.useState(""); const [result, setResult] = React.useState(""); const [from, setFrom] = React.useState("Auto detect"); const [to, setTo] = React.useState("English"); const [isTranslating, setIsTranslating] = React.useState(false); const [listening, setListening] = React.useState(false); const [copied, setCopied] = React.useState(false); const [saved, setSaved] = React.useState(false); const [tone, setTone] = React.useState("Friendly"); const textareaRef = React.useRef(null); const uploadRef = React.useRef(null); const imageRef = React.useRef(null);
  const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Arabic", "Chinese", "Portuguese", "Korean"]; const languageCodes = { English: "en", Hindi: "hi", Spanish: "es", French: "fr", German: "de", Japanese: "ja", Arabic: "ar", Chinese: "zh", Portuguese: "pt", Korean: "ko" };
  React.useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 280)}px`; } }, [text]);
  const translate = async () => { if (!text.trim() || isTranslating) return; setIsTranslating(true); setResult(""); try { const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, sourceLanguage: from === "Auto detect" ? "auto" : languageCodes[from], targetLanguage: languageCodes[to], sourceType: "text" }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Translation failed."); setResult(data.translation || data.translatedText || "Translation unavailable."); } catch (error) { setResult(`Translation unavailable: ${error.message}`); } finally { setIsTranslating(false); } };
  const listen = () => { const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return setResult("Voice input is not supported in this browser."); const recognition = new Recognition(); recognition.lang = "en-US"; recognition.onstart = () => setListening(true); recognition.onend = () => setListening(false); recognition.onresult = (event) => setText((value) => `${value} ${event.results[0][0].transcript}`.trim()); recognition.start(); };
  const swap = () => { setFrom(to); setTo(from === "Auto detect" ? "English" : from); }; const paste = async () => { const value = await navigator.clipboard?.readText(); if (value) setText((current) => `${current} ${value}`.trim()); }; const copyResult = async () => { if (result) { await navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1200); } }; const speak = () => result && window.speechSynthesis?.speak(new SpeechSynthesisUtterance(result)); const download = () => { if (!result) return; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([result], { type: "text/plain" })); a.download = "translation.txt"; a.click(); URL.revokeObjectURL(a.href); }; const fileReady = (event) => { const file = event.target.files?.[0]; if (file) setText(`Ready to translate: ${file.name}`); };
  const quick = [[Mic, "Voice Conversation"], [Upload, "Upload Document"], [ScanLine, "OCR Scanner"], [PenLine, "AI Rewrite"], [WandSparkles, "Grammar Fix"], [BookOpen, "Summarize"], [Globe2, "Translate Website"]]; const support = [[Mic, "Voice Conversation", "Talk naturally in two languages."], [ImageIcon, "Image OCR", "Extract and translate text from images."], [FileText, "PDF Translator", "Preserve meaning across documents."], [WandSparkles, "AI Rewriter", "Make translated text feel natural."], [BookOpen, "Summarizer", "Find the signal in long content."], [PenLine, "Grammar Checker", "Polish every sentence automatically."]]; const recent = ["mera papa meri inspiration hai", "hey guys how are you", "Meeting notes for tomorrow"];
  const quickAction = (label) => { if (label === "New translation") return (setText(""), setResult("")); if (label === "Voice Conversation") return listen(); if (label === "Upload Document") return uploadRef.current?.click(); if (label === "OCR Scanner") return imageRef.current?.click(); if (label === "Translate Website") return setText("Paste the website text or URL you want to translate."); const prompts = { "AI Rewrite": "Rewrite the following text naturally and clearly:\n", "Grammar Fix": "Correct the grammar and improve the clarity of:\n", Summarize: "Summarize the following text in simple language:\n" }; if (prompts[label]) setText((value) => prompts[label] + value); };
  return <section className="translator-dashboard"><div className="translator-dashboard-head"><div><p className="translator-kicker"><Sparkles size={14} /> AI TRANSLATOR <span className="live-dot" /> WORKSPACE</p><h1>Make language<br /><em>move with you.</em></h1></div><p>One calm place for every translation,<br />conversation, and idea.</p></div><div className="translator-controls"><label><span>From</span><select value={from} onChange={(e) => setFrom(e.target.value)}><option>Auto detect</option>{languages.map((l) => <option key={l}>{l}</option>)}</select></label><button type="button" onClick={swap} className="control-swap"><ArrowLeftRight size={15} /></button><label><span>To</span><select value={to} onChange={(e) => setTo(e.target.value)}>{languages.map((l) => <option key={l}>{l}</option>)}</select></label><div className="mode-pills"><button className="active"><FileText size={14} /> Text</button><button><Mic size={14} /> Voice</button><button><ImageIcon size={14} /> Image</button><button><Upload size={14} /> PDF</button></div><button className="control-icon"><Sparkles size={15} /> AI mode</button><button className="control-icon"><History size={15} /> History</button><button className="control-icon"><Star size={15} /> Saved</button><button className="control-icon"><Settings size={15} /></button></div><input ref={uploadRef} type="file" accept="application/pdf,.doc,.docx" hidden onChange={fileReady} /><input ref={imageRef} type="file" accept="image/*" hidden onChange={fileReady} /><div className="translator-dashboard-grid"><aside className="workspace-sidebar"><p className="side-label">QUICK ACTIONS</p><button className="quick-action primary" onClick={() => quickAction("New translation")}><Sparkles size={16} /> New translation</button>{quick.map(([Icon, label]) => <button className="quick-action" key={label} onClick={() => quickAction(label)}><Icon size={16} /> {label}</button>)}<p className="side-label side-space">YOUR SPACE</p><button className="quick-action" onClick={() => setSaved(!saved)}><Star size={16} /> Saved translations</button><button className="quick-action" onClick={() => document.querySelector(".recent-section")?.scrollIntoView({ behavior: "smooth" })}><History size={16} /> Recent files</button></aside><main className="primary-workspace"><div className="workspace-title"><div><span className="eyebrow">TRANSLATE / {to.toUpperCase()}</span><h2>What would you like to say?</h2></div><span className="auto-badge"><i /> {from === "Auto detect" ? "Auto-detected" : from}</span></div><div className="editor-card"><textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type, paste, or drop a file here…" /><div className="editor-suggestion">{text ? "Context and natural phrasing are ready." : "Tip: press ⌘ Enter to translate"}</div><div className="editor-tools"><button type="button" onClick={listen}><Mic size={16} /> {listening ? "Listening…" : "Voice"}</button><label><ImageIcon size={16} /> Image<input type="file" accept="image/*" hidden onChange={fileReady} /></label><label><Upload size={16} /> PDF<input type="file" accept="application/pdf" hidden onChange={fileReady} /></label><button type="button" onClick={paste}><ClipboardPaste size={16} /> Paste</button><button type="button" onClick={() => setText("")}><X size={16} /> Clear</button><span>{text.length} / 5000</span></div></div><button className="dashboard-translate" type="button" disabled={!text.trim() || isTranslating} onClick={translate}>{isTranslating ? "Translating…" : <><Sparkles size={17} /> Translate <span>⌘ Enter ↗</span></>}</button><section className="support-row">{support.map(([Icon, title, copy]) => <article key={title}><Icon size={18} /><b>{title}</b><span>{copy}</span></article>)}</section><section className="recent-section"><div className="section-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h3>Recent translations</h3></div><button>View all ↗</button></div><div className="recent-grid">{recent.map((item, i) => <article key={item}><span>{i % 2 ? "Hindi → English" : "Auto → English"}</span><p>{item}</p><small>Today · <button><Star size={13} /></button></small><button className="open-recent" onClick={() => setText(item)}>Open again</button></article>)}</div></section></main><aside className="ai-results"><div className="results-heading"><span className="eyebrow"><Sparkles size={13} /> RESULTS</span><span className="live-dot" /></div><section className="result-block"><span className="result-label">TRANSLATION</span><p className={result ? "result-text" : "result-placeholder"}>{result || "Your translated meaning will appear here."}</p><div className="result-actions"><button onClick={speak}><Volume2 size={14} /> Play</button><button onClick={copyResult}><Copy size={14} /> {copied ? "Copied" : "Copy"}</button><button onClick={download}><Download size={14} /> Save</button></div></section><section className="result-block"><span className="result-label">EXPLANATION</span><p className="muted-copy">{result ? "The translation preserves the original intent and tone. Select a tone below to guide your next version." : "Difficult words, grammar notes, and alternative meanings will appear here."}</p></section><section className="result-block"><span className="result-label">TONE</span><div className="option-chips">{["Professional", "Friendly", "Academic", "Business", "Casual"].map((x) => <button className={tone === x ? "selected" : ""} onClick={() => setTone(x)} key={x}>{x}</button>)}</div></section><section className="result-block"><span className="result-label">ALTERNATIVES</span><div className="alternative-line"><span>01</span><p>{result || "Alternative translations will appear here."}</p></div><div className="alternative-line"><span>02</span><p>{result ? "A natural phrasing with preserved intent." : "Natural phrasing with preserved intent."}</p></div></section></aside></div><div className="insights-strip"><div><span>LANGUAGE INSIGHTS</span><b>3.2k</b><small>characters translated</small></div><div><span>ACCURACY</span><b>98.4%</b><small>context confidence</small></div><div><span>RESPONSE TIME</span><b>1.2s</b><small>average response</small></div><div className="activity-bars"><span>WEEKLY ACTIVITY</span><i /><i /><i /><i /><i /><i /><i /></div></div><div className="supported-languages"><span className="eyebrow">SUPPORTED LANGUAGES</span>{languages.map((l) => <span key={l} title={l}>{l}</span>)}</div><div className="shortcuts"><span><b>⌘ Enter</b> Translate</span><span><b>⌘ ⇧ V</b> Voice</span><span><b>⌘ O</b> Upload</span><span><b>Esc</b> Clear</span></div></section>;
}

const storyFormats = ["Text", "PDF", "Word", "PowerPoint", "Excel", "Images", "Camera", "Voice", "Audio", "Videos", "Scanned Documents", "Handwriting", "Websites", "Emails", "Books", "Subtitles", "Notes"];
const storyLanguages = ["Hello", "Bonjour", "Hola", "नमस्ते", "こんにちは", "안녕하세요", "مرحبا", "Привет", "Ciao", "Olá", "你好", "สวัสดี", "Salam", "Shalom", "Merhaba", "Jambo"];

function StorySections() {
  const [demoText, setDemoText] = React.useState("");
  return <section className="story"><motion.section id="universe" className="story-block universe" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><div className="word-cloud">{storyLanguages.map((word, index) => { const lane = Math.floor(index / 2); const left = index % 2 === 0 ? 4 + (lane % 3) * 7 : 76 - (lane % 3) * 5; return <span key={word} style={{ "--i": index, left: `${left}%`, top: `${8 + lane * 6}%` }}>{word}</span>; })}</div><div className="story-center"><small>01 / AI LANGUAGE UNIVERSE</small><h2>Every language deserves to be understood.</h2><p>Powered by advanced AI capable of understanding context, meaning, tone, and intent.</p></div></motion.section><motion.section className="story-block why" initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}><small>02 / WHY WE BUILT THIS</small><h2>Translation should<br /><em>never be a barrier.</em></h2><p>Most translators replace words. Our AI understands what people mean, wherever language takes them.</p><span className="meaning-anchor" aria-label="Hover to translate Japanese greeting" /><div className="scenario-row"><span>Research</span><span>Travel</span><span>Business</span><span>Medical</span><span>Legal</span><span>Code</span></div></motion.section></section>;
}

function EndMark() {
  return <motion.section className="end-mark" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .9, ease: EASE }}><div className="end-mark-meta"><span>TRANSLIXOR</span><span>Language, understood.</span></div><div className="end-mark-word">TRANSLIXOR</div></motion.section>;
}

function App() {
  const isTranslator = window.location.pathname === "/translator";
  const isLogin = window.location.pathname === "/login";
  const isFeatures = window.location.pathname === "/features";
  const cursorX = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const cursorY = useSpring(useMotionValue(0), { stiffness: 90, damping: 18 });
  const cursorRotateY = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const cursorRotateX = useSpring(useMotionValue(0), { stiffness: 80, damping: 16 });
  const handlePointerMove = (event) => { if (isTranslator || isFeatures) return; const x = (event.clientX / window.innerWidth - .5) * 2; const y = (event.clientY / window.innerHeight - .5) * 2; cursorX.set(x * 48); cursorY.set(y * 30); cursorRotateY.set(x * 7); cursorRotateX.set(y * -5); };
  const resetPointer = () => { cursorX.set(0); cursorY.set(0); cursorRotateX.set(0); cursorRotateY.set(0); };
  if (isLogin) return <AuthPage />;
  return <main id="top" onPointerMove={handlePointerMove} onPointerLeave={resetPointer} className={`page ${isTranslator || isFeatures ? "inner-route" : ""}`}>{!isTranslator && !isFeatures && <><motion.div className="video-wrap" style={{ x: cursorX, y: cursorY, rotateX: cursorRotateX, rotateY: cursorRotateY }} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, ease: EASE }}><video autoPlay muted playsInline preload="auto" src="/robotic-hand.mp4" /></motion.div><Footer /><StorySections /><EndMark /></>}{isTranslator && <TranslatorPage />}{isFeatures && <Details />}<TopNav /></main>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
