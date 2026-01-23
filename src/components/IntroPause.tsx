import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../context/language-context';

export const IntroPause: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { lang } = useLang();
  const quotes: Record<string, string> = {
    en: "Architecture is the reaching out for the light.",
    ar: "العمارة هي السعي الحثيث نحو الضوء.",
    tr: "Mimarlık, ışığa ulaşma çabasıdır."
  };

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 1.2 }}
      className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="relative flex flex-col items-center max-w-2xl text-center px-8">
        <motion.p 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5 }} 
          className="text-white/80 font-serif italic text-2xl md:text-4xl mb-16 leading-relaxed"
        >
          {quotes[lang] || quotes.en}
        </motion.p>
        <div className="relative w-48 md:w-80 h-[1px] bg-white/5 overflow-hidden mb-8">
          <motion.div 
            initial={{ width: 0, left: "50%" }} 
            animate={{ width: "100%", left: "0%" }} 
            transition={{ duration: 1.8 }} 
            className="absolute h-full bg-[#d4a373] shadow-[0_0_30px_rgba(212,163,115,0.6)]" 
          />
        </div>
        <span className="text-[9px] uppercase tracking-[1.2em] text-white/30 font-black">Atelier Mariam</span>
      </div>
    </motion.div>
  );
};
