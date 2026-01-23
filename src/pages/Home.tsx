import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLang } from '../context/language-context';
import { ArrowRight } from 'lucide-react';
import { HERO_CONFIG } from '../data/hero.data';
import { AboutInfo } from '../types/schema';

export const Home = ({ info }: { info: AboutInfo }) => {
  const { lang, isRtl, t } = useLang();
  const navigate = useNavigate();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 60);
      mouseY.set((e.clientY - window.innerHeight / 2) / 60);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const architectName = (lang === 'ar' ? info?.nameAr : (lang === 'tr' ? info?.nameTr : info?.nameEn)) || t.hero.name;
  const dynamicStatement = (lang === 'ar' ? info?.statementAr : (lang === 'tr' ? info?.statementTr : info?.statementEn)) || t.hero.sub;
  const heroBackground = info?.heroBg || HERO_CONFIG.background;

  return (
    <section className="relative min-h-[140vh] flex flex-col items-center justify-start overflow-hidden bg-[#050505]">
      <motion.div 
        {...HERO_CONFIG.animations.heroVisual}
        style={{ x: springX, y: springY, scale: 1.1 } as any}
        className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      >
        <img src={heroBackground} className="w-full h-full object-cover opacity-50 grayscale-[20%]" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
      </motion.div>

      <div className="relative z-10 text-center w-full max-w-7xl mx-auto px-6 pt-56 md:pt-72">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <span className="text-[#d4a373] font-black uppercase border border-[#d4a373]/20 px-8 py-3 rounded-full bg-black/50 backdrop-blur-3xl shadow-2xl inline-block text-[10px] tracking-[0.7em]">
            {t.hero.role}
          </span>
        </motion.div>

        <motion.h1 
          {...HERO_CONFIG.animations.mainTitle}
          style={{ fontSize: 'var(--dyn-name-size)' }}
          className="font-serif font-bold mb-6 text-[#d4a373] tracking-tighter leading-[0.9] drop-shadow-2xl px-4"
        >
          {architectName}
        </motion.h1>

        <motion.h2 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }} 
          className="text-xl md:text-3xl lg:text-4xl font-serif italic text-white mb-16 tracking-tight max-w-5xl mx-auto px-4 opacity-80"
        >
          {t.hero.title}
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <button onClick={() => navigate('/projects')} className="group bg-white text-black px-12 py-6 md:px-16 md:py-7 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-6 hover:bg-[#d4a373] transition-all duration-500 shadow-2xl mx-auto">
            <span>{t.hero.cta}</span>
            <ArrowRight size={22} className={`transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-4' : 'group-hover:translate-x-4'}`} />
          </button>
        </motion.div>

        <motion.div 
          {...HERO_CONFIG.animations.dnaGrid}
          className="mt-60 max-w-4xl mx-auto px-6 text-center"
        >
            <p className="text-[#d4a373] text-[11px] uppercase tracking-[1em] font-black mb-12 opacity-60">{t.hero.statement}</p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-white/80 leading-[1.2] px-4">
              "{dynamicStatement}"
            </p>
        </motion.div>
      </div>
    </section>
  );
};
