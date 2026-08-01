import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "motion/react";
import { Mic, Volume2, Image as ImageIcon, Languages, Sparkles } from "lucide-react";
import React from "react";
import "./styles.css";

const EASE = [0.16, 1, 0.3, 1];

function Footer() {
  return <motion.footer className="footer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}><div className="footer-left"><motion.div className="subtitle" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }}><i />Best digital banking card 2026</motion.div><motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }}>One Card, Zero<br />Limits. Worldwide.</motion.h1><motion.div className="actions" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8, ease: EASE }}><a className="button primary" href="#features">See Features</a><a className="button secondary" href="#how-it-works">How It Works</a></motion.div></div></motion.footer>;
}

function TopNav() {
  return <motion.header className="top-nav" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: EASE }}><a className="nav-logo" href="/" aria-label="Home"><span className="logo-t">T</span></a><nav><a href="/translator">Translator</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#support">Support</a></nav></motion.header>;
}

function TranslatorPage() {
  const [text, setText] = React.useState("");
  const [result, setResult] = React.useState("");
  const [to, setTo] = React.useState("English");
  const [listening, setListening] = React.useState(false);
  const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Arabic", "Chinese", "Portuguese"];
  const translate = async () => { if (!text.trim()) return; setResult("Translating…"); try { const response = await fetch("/api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, targetLanguage: to.toLowerCase(), sourceType: "text" }) }); const data = await response.json(); setResult(data.translation || data.translatedText || "Translation unavailable."); } catch { setResult("Connect the translation API to enable live translation."); } };
  const listen = () => { const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) return setResult("Voice input is not supported in this browser."); const recognition = new Recognition(); recognition.lang = "en-US"; recognition.onstart = () => setListening(true); recognition.onend = () => setListening(false); recognition.onresult = (event) => setText((value) => `${value} ${event.results[0][0].transcript}`.trim()); recognition.start(); };
  return <section className="translator-page"><div className="translator-heading"><div><p className="translator-kicker"><Sparkles size={14} /> AI TRANSLATOR</p><h1>Every language.<br />One conversation.</h1></div><p>Translate text, speech, and images<br />in one intelligent workspace.</p></div><div className="translator-card"><div className="language-bar"><span><Languages size={15} /> Language pair</span><select defaultValue="Auto detect"><option>Auto detect</option>{languages.map((language) => <option key={language}>{language}</option>)}</select><b>→</b><select value={to} onChange={(event) => setTo(event.target.value)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></div><div className="translation-grid"><div className="translation-panel"><small>Auto detect</small><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type, paste, or speak something…" /><div className="panel-actions"><button onClick={listen} className={listening ? "active" : ""}><Mic size={15} /> {listening ? "Listening" : "Voice input"}</button><label><ImageIcon size={15} /> Image OCR<input type="file" accept="image/*" hidden /></label></div></div><div className="translation-panel"><small>{to}</small><div className="translation-result">{result || "Your translation will appear here."}</div><div className="panel-actions"><button onClick={() => result && window.speechSynthesis?.speak(new SpeechSynthesisUtterance(result))}><Volume2 size={15} /> Listen</button></div></div></div><button className="translate-action" onClick={translate}>Translate <span>↗</span></button></div><div className="translator-features"><span><Mic size={16} /> Voice-to-text</span><span><Volume2 size={16} /> Text-to-speech</span><span><ImageIcon size={16} /> OCR ready</span><span><Languages size={16} /> 150+ languages</span></div></section>;
}

function App() {
  const isTranslator = window.location.pathname === "/translator";
  return <main id="top" className={`page ${isTranslator ? "translator-route" : ""}`}>{!isTranslator && <><motion.div className="video-wrap" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: EASE }}><video autoPlay muted loop playsInline preload="auto" src="/robotic-hand.mp4" /></motion.div><Footer /></>}{isTranslator && <TranslatorPage />}<TopNav /></main>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
