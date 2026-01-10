import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../language-context';
import { ArrowRight, Fingerprint } from 'lucide-react';

export const Home = ({ onNavigate, info }: any) => {
  const { lang } = useLang();

  /* ===== SAFE CONTENT (NO t.hero) ===== */

  const hero = {
    role: {
      en: 'Architect & Interior Designer',
      ar: 'مهندسة معمارية ومصممة داخلية',
      tr: 'Mimar & İç Mekan Tasarımcısı',
    },
    title: {
      en: 'Designing Spaces with Meaning',
      ar: 'تصميم مساحات ذات معنى',
      tr: 'Anlamlı Mekanlar Tasarlamak',
    },
    sub: {
      en: 'A contemporary architectural approach blending form, function, and emotion.',
      ar: 'مقاربة معمارية معاصرة تمزج بين الشكل والوظيفة والإحساس.',
      tr: 'Form, işlev ve duyguyu birleştiren çağdaş bir mimari yaklaşım.',
    },
    cta: {
      en: 'View Projects',
      ar: 'عرض المشاريع',
      tr: 'Projeleri Gör',
    },
    dnaTitle: {
      en: 'Design DNA',
      ar: 'الهوية التصميمية',
      tr: 'Tasarım DNA',
    },
    dna: {
      en: [
        { title: 'Concept', desc: 'Every project starts with a strong conceptual narrative.' },
        { title: 'Context', desc: 'Architecture that responds to culture, place, and people.' },
        { title: 'Detail', desc: 'Precision in details creates timeless spaces.' },
      ],
      ar: [
        { title: 'الفكرة', desc: 'كل مشروع يبدأ برؤية تصميمية واضحة.' },
        { title: 'السياق', desc: 'عمارة تستجيب للمكان والثقافة والإنسان.' },
        { title: 'التفاصيل', desc: 'الدقة في التفاصيل تصنع فراغات خالدة.' },
      ],
      tr: [
        { title: 'Konsept', desc: 'Her proje güçlü bir tasarım fikriyle başlar.' },
        { title: 'Bağlam', desc: 'Mekan, kültür ve insanla uyumlu mimari.' },
        { title: 'Detay', desc: 'Detaylardaki hassasiyet zamansızlık yaratır.' },
      ],
    },
  };

  const architectName =
    (lang === 'ar'
      ? info?.nameAr
      : lang === 'tr'
      ? info?.nameTr
      : info?.nameEn) || 'Atelier';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover scale-105"
          alt="Interior Architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full border border-[#d4a373]/30 text-[#d4a373] text-[10px] uppercase tracking-[0.4em] bg-black/30">
            {hero.role[lang]}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[8vw] md:text-[5rem] lg:text-[6rem] font-serif font-bold mb-6 text-white leading-[0.9]"
        >
          {architectName}
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-3xl font-serif italic text-white/60 mb-8"
        >
          {hero.title[lang]}
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-14 font-light"
        >
          {hero.sub[lang]}
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => onNavigate('projects')}
          className="bg-[#E3D4B6] text-black px-10 py-5 rounded-full text-xs font-serif font-bold tracking-widest flex items-center gap-4 hover:scale-105 transition-all"
        >
          {hero.cta[lang]}
          <ArrowRight size={18} />
        </motion.button>

        import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../language-context';
import { ArrowRight, Fingerprint } from 'lucide-react';

export const Home = ({ onNavigate, info }: any) => {
  const { lang } = useLang();

  /* ===== SAFE CONTENT (NO t.hero) ===== */

  const hero = {
    role: {
      en: 'Architect & Interior Designer',
      ar: 'مهندسة معمارية ومصممة داخلية',
      tr: 'Mimar & İç Mekan Tasarımcısı',
    },
    title: {
      en: 'Designing Spaces with Meaning',
      ar: 'تصميم مساحات ذات معنى',
      tr: 'Anlamlı Mekanlar Tasarlamak',
    },
    sub: {
      en: 'A contemporary architectural approach blending form, function, and emotion.',
      ar: 'مقاربة معمارية معاصرة تمزج بين الشكل والوظيفة والإحساس.',
      tr: 'Form, işlev ve duyguyu birleştiren çağdaş bir mimari yaklaşım.',
    },
    cta: {
      en: 'View Projects',
      ar: 'عرض المشاريع',
      tr: 'Projeleri Gör',
    },
    dnaTitle: {
      en: 'Design DNA',
      ar: 'الهوية التصميمية',
      tr: 'Tasarım DNA',
    },
    dna: {
      en: [
        { title: 'Concept', desc: 'Every project starts with a strong conceptual narrative.' },
        { title: 'Context', desc: 'Architecture that responds to culture, place, and people.' },
        { title: 'Detail', desc: 'Precision in details creates timeless spaces.' },
      ],
      ar: [
        { title: 'الفكرة', desc: 'كل مشروع يبدأ برؤية تصميمية واضحة.' },
        { title: 'السياق', desc: 'عمارة تستجيب للمكان والثقافة والإنسان.' },
        { title: 'التفاصيل', desc: 'الدقة في التفاصيل تصنع فراغات خالدة.' },
      ],
      tr: [
        { title: 'Konsept', desc: 'Her proje güçlü bir tasarım fikriyle başlar.' },
        { title: 'Bağlam', desc: 'Mekan, kültür ve insanla uyumlu mimari.' },
        { title: 'Detay', desc: 'Detaylardaki hassasiyet zamansızlık yaratır.' },
      ],
    },
  };

  const architectName =
    (lang === 'ar'
      ? info?.nameAr
      : lang === 'tr'
      ? info?.nameTr
      : info?.nameEn) || 'Atelier';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover scale-105"
          alt="Interior Architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full border border-[#d4a373]/30 text-[#d4a373] text-[10px] uppercase tracking-[0.4em] bg-black/30">
            {hero.role[lang]}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[8vw] md:text-[5rem] lg:text-[6rem] font-serif font-bold mb-6 text-white leading-[0.9]"
        >
          {architectName}
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg md:text-3xl font-serif italic text-white/60 mb-8"
        >
          {hero.title[lang]}
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-14 font-light"
        >
          {hero.sub[lang]}
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={() => onNavigate('projects')}
          className="bg-[#E3D4B6] text-black px-10 py-5 rounded-full text-xs font-serif font-bold tracking-widest flex items-center gap-4 hover:scale-105 transition-all"
        >
          {hero.cta[lang]}
          <ArrowRight size={18} />
        </motion.button>

        {/* DNA */}
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
  className="mt-32 border-t border-white/10 pt-16"
>
  <div className="flex justify-center mb-16 text-[#d4a373] text-[10px] uppercase tracking-[0.4em] gap-2">
    <Fingerprint size={14} /> {hero.dnaTitle[lang]}
  </div>

  <div className="grid md:grid-cols-3 gap-12">
    {hero.dna[lang].map((item, idx) => (
      <div key={idx} className="border-l border-white/10 pl-8">
        <h3 className="text-xl font-serif italic mb-3 text-white">
          {item.title}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</motion.div>
