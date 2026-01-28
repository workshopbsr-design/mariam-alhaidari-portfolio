import React from 'react';
import { motion } from 'framer-motion';
import { Download, Quote } from 'lucide-react';

import { useLang } from '../context/language-context';
import { useAbout } from '../hooks/useAbout';

/**
 * About Page
 * - Self-contained
 * - No props
 * - Data source: useAbout only
 * - Safe fallback handling
 */
export const About = () => {
  const { t, lang, isRtl } = useLang();
  const { aboutInfo, isLoading, error } = useAbout();

  /* ------------------------------------------------------------------ */
  /* 🛑 States                                                           */
  /* ------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        Loading…
      </div>
    );
  }

  if (error || !aboutInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        {isRtl ? 'تعذر تحميل المعلومات' : 'Failed to load information'}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* 🔧 Helpers                                                          */
  /* ------------------------------------------------------------------ */

  const getContent = (key: string) => {
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    return (
      (aboutInfo as any)[`${key}${suffix}`] ||
      (aboutInfo as any)[key] ||
      (t.about as any)[key] ||
      ''
    );
  };

  const profileImg =
    aboutInfo.profileImage ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200';

  const resumeUrl = aboutInfo.resumeUrl || '';

  const handleDownload = (e: React.MouseEvent) => {
    if (!resumeUrl || resumeUrl === '#') {
      e.preventDefault();
      alert(
        isRtl
          ? 'ملف الأعمال غير متوفر حالياً'
          : 'Portfolio file is not available yet.'
      );
    }
  };

  /* ------------------------------------------------------------------ */
  /* 🎨 Render                                                           */
  /* ------------------------------------------------------------------ */

  return (
    <div
      className="max-w-6xl mx-auto px-6 py-40 min-h-screen"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-48 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="aspect-[4/5] bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group"
        >
          <img
            src={profileImg}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
            alt="Architect Profile"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#d4a373] mb-6 block font-black">
            {t.about.bioTitle}
          </span>

          <h1 className="text-5xl md:text-7xl font-serif italic mb-10 text-white leading-tight">
            {getContent('name')}
          </h1>

          <p className="text-xl text-white/70 font-light leading-relaxed mb-12 italic">
            {getContent('bio')}
          </p>

          <a
            href={resumeUrl && resumeUrl !== '#' ? resumeUrl : undefined}
            onClick={handleDownload}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-4 px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black transition-all ${
              resumeUrl && resumeUrl !== '#'
                ? 'bg-white text-black hover:bg-[#d4a373]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Download size={16} /> {t.about.download}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-24 px-8 md:px-20 bg-white/[0.02] border border-white/5 rounded-[4rem] text-center mb-48"
      >
        <Quote className="text-[#d4a373]/20 mx-auto mb-10" size={80} />
        <p className="text-4xl md:text-6xl font-serif italic text-white/90 leading-tight">
          "{getContent('philosophy')}"
        </p>
      </motion.div>
    </div>
  );
};
