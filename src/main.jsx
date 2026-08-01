import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "motion/react";
import "./styles.css";

const EASE = [0.16, 1, 0.3, 1];
const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

function Footer() {
  return <motion.footer className="footer" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1, ease: EASE }}>
    <div className="footer-left" aria-hidden="true" />
  </motion.footer>;
}

function App() {
  return <main id="top" className="page"><motion.div className="video-wrap" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: EASE }}><video autoPlay muted loop playsInline src={VIDEO_URL} /></motion.div><h1 className="background-title">AI TRANSLATOR</h1></main>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
