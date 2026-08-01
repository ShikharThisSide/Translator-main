import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Mic, Volume2, Image as ImageIcon, Languages, Sparkles } from "lucide-react";
import "./styles.css";

const EASE = [0.16, 1, 0.3, 1];
const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

function Footer() {
  return <motion.footer className="footer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
    <div className="footer-left" aria-hidden="true" />
  </motion.footer>;
}

function App() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1.22, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.92, 0.72]);

  return <main id="top" className="page"><motion.div className="video-wrap" style={{ scale, y, rotate, opacity }} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease: EASE }}><video autoPlay muted loop playsInline src={VIDEO_URL} /></motion.div><TopNav /><section className="scroll-space" aria-hidden="true" /><TranslatorWorkspace /></main>;
}

function TopNav() {
  return <motion.header className="top-nav" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8, ease: EASE }}><a className="nav-logo" href="#top" aria-label="AI Translator home"><span>AI</span></a><nav><a href="#translator">Translator</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#support">Support</a></nav></motion.header>;
}

function TranslatorWorkspace() {
  const [source, setSource] = React.useState("");
  const [result, setResult] = React.useState("");
  const [from, setFrom] = React.useState("Auto detect");
  const [to, setTo] = React.useState("English");
  const [listening, setListening] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Arabic", "Chinese", "Portuguese"];

  const translate = async () => {
    if (!source.trim()) return;
    setResult("Translating…");
    try {
      const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: source, targetLanguage: to.toLowerCase(), sourceType: "text" }) });
      const data = await response.json();
      setResult(data.translation || data.translatedText || "Translation unavailable.");
    } catch { setResult("Connect the translation API to enable live translation."); }
  };

  const speak = (text) => { if (text && "speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)); };
  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return setResult("Voice input is not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; recognition.onstart = () => setListening(true); recognition.onend = () => setListening(false);
    recognition.onresult = (event) => setSource((current) => `${current} ${event.results[0][0].transcript}`.trim()); recognition.start();
  };

  return <section className="translator-section" id="translator"><div className="workspace-heading"><div><p className="workspace-kicker"><Sparkles size={14} /> AI TRANSLATOR</p><h2>Every language.<br />One conversation.</h2></div><p className="workspace-note">Translate text, speech, and images in one intelligent workspace.</p></div><div className="translator-card"><div className="translator-toolbar"><span><Languages size={16} /> Language pair</span><select value={from} onChange={(event) => setFrom(event.target.value)}><option>Auto detect</option>{languages.map((language) => <option key={language}>{language}</option>)}</select><span className="arrow">→</span><select value={to} onChange={(event) => setTo(event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></div><div className="translation-grid"><div className="input-panel"><span className="panel-label">{from}</span><textarea value={source} onChange={(event) => setSource(event.target.value)} placeholder="Type, paste, or speak something…" /><div className="panel-actions"><button onClick={listen} className={listening ? "active" : ""}><Mic size={16} /> {listening ? "Listening" : "Voice input"}</button><label><ImageIcon size={16} /> Image OCR<input type="file" accept="image/*" hidden onChange={(event) => setImage(event.target.files?.[0] || null)} /></label></div></div><div className="input-panel result-panel"><span className="panel-label">{to}</span><div className="result-text">{result || "Your translation will appear here."}</div><div className="panel-actions"><button onClick={() => speak(result)}><Volume2 size={16} /> Listen</button>{image && <span className="image-ready">{image.name}</span>}</div></div></div><button className="translate-button" onClick={translate}>Translate <span>↗</span></button></div><div className="feature-strip"><span><Mic size={17} /> Voice-to-text</span><span><Volume2 size={17} /> Text-to-speech</span><span><ImageIcon size={17} /> OCR ready</span><span><Languages size={17} /> 150+ languages</span></div></section>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
