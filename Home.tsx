import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from './language-context';
import { ArrowRight, Fingerprint } from 'lucide-react';

export const Home = ({ onNavigate, info }: any) => {
  const { t, lang } = useLang();

  // Determine name based on language, fallback to translation file if not set in CMS
  const architectName = (lang === 'ar' ? info?.nameAr : (lang === 'tr' ? info?.nameTr : info?.nameEn)) || t.hero.name;

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-6 pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background: High-end Interior Architecture Shot */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover scale-105"
          alt="Interior Architecture & Design"
        />
        {/* Dark overlay with gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
        
        {/* Role Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <span className="px-4 py-1.5 rounded-full border border-[#d4a373]/30 text-[#d4a373] text-[10px] md:text-xs uppercase tracking-[0.4em] bg-black/20 backdrop-blur-sm">
            {t.hero.role}
          </span>
        </motion.div>

        {/* Architect Name - Scaled down slightly for one-line elegance */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[8vw] md:text-[5rem] lg:text-[6rem] xl:text-[7rem] font-serif font-bold mb-4 text-white tracking-tighter leading-[0.9] drop-shadow-2xl mix-blend-overlay opacity-90 whitespace-nowrap"
        >
          {architectName}
        </motion.h1>

        {/* Studio Title - Secondary */}
        <motion.h2
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.7 }}
           className="text-lg md:text-3xl lg:text-4xl font-serif italic text-white/50 mb-8 md:mb-10 tracking-tight px-4"
        >
          {t.hero.title}
        </motion.h2>

        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-12 md:mb-16 font-light leading-relaxed drop-shadow-lg px-6"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="flex flex-col items-center gap-12"
        >
          <button
            onClick={() => onNavigate('projects')}
            className="group relative bg-[#E3D4B6] text-black px-10 md:px-14 py-5 md:py-6 rounded-full text-xs md:text-sm font-serif font-bold tracking-widest flex items-center gap-4 hover:bg-[#d4c2a0] transition-all hover:scale-105 shadow-[0_0_50px_rgba(227,212,182,0.15)] overflow-hidden"
          >
            <span className="relative z-10">{t.hero.cta}</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Design DNA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 border-t border-white/10 pt-16 w-full text-left md:text-center"
        >
           <div className="flex flex-col md:flex-row items-baseline justify-center gap-4 mb-16">
              <span className="text-[#d4a373] text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
                 <Fingerprint size={14} /> {t.hero.dnaTitle}
              </span>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
              {t.hero.dna.map((step: any, idx: number) => (
                  <div key={idx} className="group relative border-l border-white/5 pl-8 hover:border-[#d4a373] transition-colors duration-500">
                     <h3 className="text-xl md:text-2xl font-serif italic mb-4 text-white group-hover:text-[#d4a373] transition-colors">{step.title}</h3>
                     <p className="text-sm text-white/40 leading-relaxed font-light">{step.desc}</p>
                  </div>
              ))}
           </div>
        </motion.div>

      </div>
    </section>
  );
};
