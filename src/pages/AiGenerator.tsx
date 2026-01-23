
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';
import { useLang } from '../context/language-context';
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
      // Corrected Gemini API client initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const targetLang = lang === 'ar' ? 'Arabic' : (lang === 'tr' ? 'Turkish' : 'English');
      
      // Using gemini-3-pro-preview for complex architectural narrative tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are a world-class senior Architect. Generate a poetic and conceptual design narrative in ${targetLang}.`,
        }
      });
      
      // Accessing the .text property directly (not a method) as per SDK specifications
      setResult(response.text || "");
    } catch (e) {
      console.error(e);
      setResult(lang === 'ar' ? "حدث خطأ في المحرك." : "Engine Error.");
    } finally {
      setLoading(false);
    }
  };

  const MotionDiv = motion.div as any;

  return (
    <div className="max-w-4xl mx-auto px-6 py-40">
      <div className="text-center mb-20">
        <MotionDiv initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 bg-[#d4a373]/10 rounded-3xl mb-6">
          <Sparkles className="text-[#d4a373]" size={32} />
        </MotionDiv>
        <h2 className="text-5xl font-serif italic mb-4 text-white">{t.ai.title}</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-bold">{t.ai.desc}</p>
      </div>

      <div className="bg-white/[0.02] p-8 md:p-12 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          placeholder={t.ai.prompt} 
          className="w-full bg-transparent border-none outline-none h-48 text-xl md:text-2xl font-serif italic text-white/80 placeholder:text-white/10 resize-none" 
        />
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/5">
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">{t.common.poweredBy}</span>
          <button 
            onClick={generate} 
            disabled={loading || !prompt.trim()} 
            className="group bg-[#d4a373] text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all disabled:opacity-30"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} 
            {loading ? t.common.thinking : t.ai.btn}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-16 p-10 md:p-16 rounded-[3rem] bg-gradient-to-br from-[#d4a373]/10 to-transparent border border-[#d4a373]/20 relative">
            <p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white/90">{result}</p>
            <div className="mt-10 flex justify-end">
              <button onClick={() => setResult("")} className="text-white/30 hover:text-[#d4a373] transition-colors flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold">
                <RefreshCw size={14} /> {t.common.clear}
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
