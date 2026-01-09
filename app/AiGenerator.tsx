import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useLang } from '../language-context';
import { GoogleGenAI } from "@google/genai";

export const AiGenerator = () => {
  const { t, lang } = useLang();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      // FIX: Initialize Gemini API following coding guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const targetLang = lang === 'ar' ? 'Arabic' : (lang === 'tr' ? 'Turkish' : 'English');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior Interior Architect and Lighting Designer. Write a poetic, high-end design description in ${targetLang} for the following concept: "${prompt}". 
        Focus on:
        1. Spatial flow and layout.
        2. Lighting atmosphere (natural vs artificial).
        3. Material textures and furniture selection.
        4. The feeling of the space.
        Keep it under 100 words.`,
      });
      setResult(response.text || "");
    } catch (e) {
      console.error(e);
      setResult(lang === 'ar' ? "فشل الاتصال بمحرك الذكاء الاصطناعي." : (lang === 'tr' ? "Yapay zeka motoruna bağlanılamadı." : "Failed to connect to AI engine."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh] flex flex-col justify-center">
      <div className="text-center mb-16">
        <Sparkles className="mx-auto mb-6 text-[#d4a373]" size={32} />
        <h2 className="text-4xl font-serif italic mb-4">{t.ai.title}</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-4">{t.ai.desc}</p>
        <p className="text-[#d4a373] text-[10px] font-medium tracking-wide opacity-80">
            {t.ai.note}
        </p>
      </div>

      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.ai.prompt}
          className="w-full bg-transparent border-none outline-none resize-none h-32 text-sm leading-relaxed"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={generate}
            disabled={loading}
            className="bg-[#d4a373] text-black px-8 py-3 rounded-full flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            {t.ai.btn}
          </button>
        </div>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-8 border-l-2 border-[#d4a373] bg-white/[0.02]"
        >
          <div className="text-[9px] text-[#d4a373] uppercase tracking-[0.3em] mb-4">{t.ai.result}</div>
          <p className="text-lg font-light leading-relaxed italic opacity-80">
            {result}
          </p>
        </motion.div>
      )}
    </div>
  );
};