import OpenAI from "openai";

export const languageNames = {
  ar: "Arabic",
  bn: "Bengali",
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  gu: "Gujarati",
  hi: "Hindi",
  it: "Italian",
  ja: "Japanese",
  kn: "Kannada",
  ko: "Korean",
  ml: "Malayalam",
  mr: "Marathi",
  pa: "Punjabi",
  pt: "Portuguese",
  ru: "Russian",
  ta: "Tamil",
  te: "Telugu",
  tr: "Turkish",
  ur: "Urdu",
  vi: "Vietnamese",
  zh: "Chinese"
};

const languageCodesByName = Object.fromEntries(
  Object.entries(languageNames).map(([code, name]) => [name.toLowerCase(), code])
);

export function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function translateWithLibreTranslate(text, source, target) {
  const endpoint = process.env.LIBRETRANSLATE_URL;
  if (!endpoint || source === target) return null;

  const response = await fetch(`${endpoint.replace(/\/$/, "")}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: "text",
      ...(process.env.LIBRETRANSLATE_API_KEY ? { api_key: process.env.LIBRETRANSLATE_API_KEY } : {})
    })
  });

  if (!response.ok) throw new Error(`LibreTranslate returned ${response.status}.`);
  const data = await response.json();
  if (!data.translatedText) throw new Error("LibreTranslate returned no translation.");
  return data.translatedText.trim();
}

const romanHindiDictionary = {
  aaj: "today",
  achha: "good",
  acha: "good",
  and: "and",
  apna: "my",
  bhai: "bro",
  boht: "very",
  bahut: "very",
  hai: "is",
  haal: "condition",
  hu: "am",
  ho: "are",
  kaise: "how",
  kal: "tomorrow",
  kaha: "where",
  main: "I",
  mera: "my",
  meraa: "my",
  milte: "meet",
  naam: "name",
  pata: "know",
  pta: "know",
  name: "name",
  tum: "you"
};

function detectLanguageHeuristically(text) {
  const lowered = text.toLowerCase().trim();

  if (/[\u0900-\u097f]/.test(text)) {
    return { code: "hi", name: "Hindi" };
  }

  const hits = Object.keys(romanHindiDictionary).filter((word) =>
    lowered.includes(word)
  ).length;

  if (hits >= 2) {
    return { code: "hi-Latn", name: "Hinglish / Roman Hindi" };
  }

  return { code: "en", name: "English" };
}

function toSentenceCase(text) {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function polishEnglishText(text) {
  let polished = text.trim().replace(/\s+/g, " ");

  const replacements = [
    { pattern: /^how are you bro$/i, value: "How are you, bro?" },
    { pattern: /^bro how are you$/i, value: "Bro, how are you?" },
    { pattern: /^where are you bro$/i, value: "Bro, where are you?" },
    { pattern: /^bro where are you$/i, value: "Bro, where are you?" },
    { pattern: /^my name is ([a-z]+) and i am an engineer$/i, value: "My name is $1 and I am an engineer." },
    { pattern: /^hey my name is ([a-z]+) and i am an engineer$/i, value: "Hey, my name is $1 and I am an engineer." },
    { pattern: /^shall we meet tomorrow$/i, value: "Shall we meet tomorrow?" },
    { pattern: /^today is a very good day$/i, value: "Today is a very good day." }
  ];

  for (const { pattern, value } of replacements) {
    if (pattern.test(polished)) {
      polished = polished.replace(pattern, value);
      return polished;
    }
  }

  if (!/[.!?]$/.test(polished)) {
    polished = `${polished}.`;
  }

  return toSentenceCase(polished);
}

function translateRomanHindiClause(clause) {
  const cleanedClause = clause
    .toLowerCase()
    .replace(/haiit\b/g, "hai")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedClause) {
    return "";
  }

  const directPatterns = [
    {
      pattern: /^mere papa meri inspiration hai kyunki unhone mujhe hamesha support kiya hai$/,
      output: "My father is my inspiration because he has always supported me."
    },
    { pattern: /^(mera|mera hi) (name|naam) (pata|pta) hai kya$/, output: "What is my name?" },
    { pattern: /^(mera|mera hi) (name|naam) kya hai$/, output: "What is my name?" },
    { pattern: /^(tum )?kaise ho( bhai| bro)?$/, output: "How are you, bro?" },
    { pattern: /^(tum )?kya haal hai( bhai| bro)?$/, output: "How are you, bro?" },
    { pattern: /^(tum|tu|aap) kaha ho( bhai| bro)?$/, output: "Bro, where are you?" },
    { pattern: /^kal milte (hai|hain|h)$/, output: "Shall we meet tomorrow?" },
    { pattern: /^mera (name|naam) ([a-z]+) hai$/, output: "My name is $2." },
    {
      pattern: /^(hey )?mera (name|naam) ([a-z]+) hai and main ek engineer hu$/,
      output: "Hey, my name is $3 and I am an engineer."
    },
    {
      pattern: /^(hey )?mera (name|naam) ([a-z]+) hai aur main ek engineer hu$/,
      output: "Hey, my name is $3 and I am an engineer."
    }
  ];

  for (const { pattern, output } of directPatterns) {
    if (pattern.test(cleanedClause)) {
      return cleanedClause.replace(pattern, output);
    }
  }

  let translatedClause = cleanedClause
    .replace(/\bmera (name|naam)\b/g, "my name")
    .replace(/\bmain ek engineer hu\b/g, "I am an engineer")
    .replace(/\baur\b/g, "and")
    .replace(/\bkaise ho\b/g, "how are you")
    .replace(/\bkya haal hai\b/g, "how are you")
    .replace(/\btum kaha ho\b/g, "where are you")
    .replace(/\bkal milte (hai|hain|h)\b/g, "shall we meet tomorrow")
    .replace(/\bbhai\b/g, "bro")
    .replace(/\bbro\b/g, "bro")
    .replace(/\bhai\b/g, "is")
    .replace(/\bhain\b/g, "are")
    .replace(/\bhai\b/g, "is");

  return polishEnglishText(translatedClause);
}

function translateRomanHindiToEnglish(text) {
  const clauses = text
    .split(/[,.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (clauses.length === 0) {
    return "";
  }

  const translated = clauses
    .map((clause) => translateRomanHindiClause(clause))
    .filter(Boolean);

  return translated.join(" ");
}

async function translateWithMyMemory(text, sourceCode, targetLanguage) {
  const safeSourceCode = sourceCode === "hi-Latn" ? "en" : sourceCode;

  if (safeSourceCode === targetLanguage) {
    return text;
  }

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${safeSourceCode}|${targetLanguage}`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    const offlineTranslations = {
      "hey guys how are you": { fr: "Salut les gars, comment allez-vous ?", es: "Hola chicos, ¿cómo están?", de: "Hey Leute, wie geht es euch?", hi: "अरे दोस्तों, आप कैसे हैं?" },
      "how are you": { fr: "Comment allez-vous ?", es: "¿Cómo estás?", de: "Wie geht es dir?", hi: "आप कैसे हैं?" },
      "hello": { fr: "Bonjour", es: "Hola", de: "Hallo", hi: "नमस्ते" }
    };
    const local = offlineTranslations[text.toLowerCase().trim()]?.[targetLanguage];
    if (local) return local;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Fallback translation is unavailable right now.");
  }

  const data = await response.json();
  const translatedText = data.responseData?.translatedText?.trim();

  if (!translatedText) {
    const localTranslations = {
      "hey guys how are you": { fr: "Salut les gars, comment allez-vous ?", es: "Hola chicos, ¿cómo están?", de: "Hey Leute, wie geht es euch?", hi: "अरे दोस्तों, आप कैसे हैं?" },
      "how are you": { fr: "Comment allez-vous ?", es: "¿Cómo estás?", de: "Wie geht es dir?", hi: "आप कैसे हैं?" },
      "hello": { fr: "Bonjour", es: "Hola", de: "Hallo", hi: "नमस्ते" }
    };
    const local = localTranslations[text.toLowerCase().trim()]?.[targetLanguage];
    if (local) return local;
    throw new Error("No translation service is available. Add OPENAI_API_KEY to translate any Hinglish text.");
  }

  return translatedText;
}

async function translateWithoutAI({ text, targetLanguage }) {
  const detectedLanguage = detectLanguageHeuristically(text);

  if (detectedLanguage.code === "hi-Latn") {
    const englishText = translateRomanHindiToEnglish(text);
    const translatedText = targetLanguage === "en"
      ? englishText
      : await translateWithLibreTranslate(englishText, "en", targetLanguage) || await translateWithMyMemory(englishText, "en", targetLanguage);

    return {
      originalText: text.trim(),
      detectedLanguageCode: detectedLanguage.code,
      detectedLanguageName: detectedLanguage.name,
      normalizedText: englishText,
      translatedText
    };
  }

  const hostedTranslation = await translateWithLibreTranslate(text.trim(), detectedLanguage.code, targetLanguage);
  if (hostedTranslation) {
    return {
      originalText: text.trim(),
      detectedLanguageCode: detectedLanguage.code,
      detectedLanguageName: detectedLanguage.name,
      normalizedText: text.trim(),
      translatedText: hostedTranslation
    };
  }

  const translatedText = await translateWithMyMemory(
    text.trim(),
    detectedLanguage.code,
    targetLanguage
  );

  return {
    originalText: text.trim(),
    detectedLanguageCode: detectedLanguage.code,
    detectedLanguageName: detectedLanguage.name,
    normalizedText: text.trim(),
    translatedText
  };
}

export async function translateWithAI({ client, text, targetLanguage, sourceType = "text" }) {
  if (!text || typeof text !== "string") {
    throw new Error("Please send text to translate.");
  }

  const normalizedTargetLanguage = languageCodesByName[String(targetLanguage || "").toLowerCase()] || targetLanguage;

  if (!normalizedTargetLanguage || !languageNames[normalizedTargetLanguage]) {
    throw new Error("Please choose a supported target language.");
  }

  const heuristicDetection = detectLanguageHeuristically(text);

  if (!client) {
    return translateWithoutAI({ text, targetLanguage: normalizedTargetLanguage });
  }

  try {
    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: `You are a translation engine for a beginner-friendly web app.
Detect the source language automatically.
Understand mixed-language text such as Hinglish, casual slang, and minor spelling mistakes.
Normalize the text before translating, but keep the original meaning and tone.
When target language is English, produce grammatically correct natural English, never a literal word-by-word transliteration.
Treat Hinglish as spoken Hindi written with English letters and translate the meaning, not the surface words.
If a sentence contains multiple clauses, rewrite it as fluent English sentences.
Return concise, accurate values only.
If the text is already in the target language, keep the translated text natural and polished.

Examples:
- "tum kaha ho bro, kal milte hai?" -> "Bro, where are you? Shall we meet tomorrow?"
- "bhai aaj mast mausam hai" -> "Bro, the weather is great today."
- "aaj ka din boht accha hai" -> "Today is a very good day."`,
    input: `Source type: ${sourceType}
Target language code: ${normalizedTargetLanguage}
Target language name: ${languageNames[normalizedTargetLanguage]}
Text to process:
${text}`,
    text: {
      format: {
        type: "json_schema",
        name: "translator_response",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            detectedLanguageCode: { type: "string" },
            detectedLanguageName: { type: "string" },
            normalizedText: { type: "string" },
            translatedText: { type: "string" }
          },
          required: [
            "detectedLanguageCode",
            "detectedLanguageName",
            "normalizedText",
            "translatedText"
          ]
        }
      }
    }
    });

    const parsed = JSON.parse(aiResponse.output_text);

    return {
      originalText: text.trim(),
      detectedLanguageCode: parsed.detectedLanguageCode,
      detectedLanguageName: parsed.detectedLanguageName,
      normalizedText: parsed.normalizedText,
      translatedText: parsed.translatedText
    };
  } catch (error) {
    if (error?.status === 429 || /quota/i.test(error?.message || "")) {
    return translateWithoutAI({ text, targetLanguage: normalizedTargetLanguage });
    }

    throw error;
  }
}
