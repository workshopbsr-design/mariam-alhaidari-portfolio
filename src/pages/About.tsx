import React from 'react';
import { motion } from 'framer-motion';
import { Download, Quote } from 'lucide-react';

import { useLang } from '../context/language-context';
import { useAbout } from '../hooks/useAbout';

/**
 * About Page
 * ----------------------------------------------------
 * - Self-contained page (no props)
 * - Single source of data: useAbout
 * - Router passes ZERO data
 * - Fully owns its loading / error / empty states
 */
export const About: React.FC = () => {
  const { t, lang, isRtl } = useLang();
  const { aboutInfo, isLoading, error } = useAbout();

  /* ------------------------------------------------------------------ */
  /* 🛑 State handling                                                   */
  /* ------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-[#d4a373] mx-auto mb-4" />
          <p className="text-white/40 text-sm tracking-wider">
            {isRtl ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-xl text-red-400 mb-3">
            {isRtl ? 'حدث خطأ' : 'Something went wrong'}
          </h2>
          <p className="text-white/60 mb-6 text-sm">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-xs uppercase tracking-wider transition"
          >
            {isRtl ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!aboutInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40">
        {isRtl ? 'لا توجد بيانات متاحة' : 'No data available'}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* 🔧 Helpers                                                          */
  /* ------------------------------------------------------------------ */

  const getContent = (key: string): string => {
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    return (
      (aboutInfo as any)[`${key}${suffix}`] ||
      (aboutInfo as any)[key] ||
      (t.about as any)[key] ||
      ''
    );
  };

  const profileImage =
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
      {/* Image + Bio */}
      <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-48 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="aspect-[4/5] bg-white/5 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group"
        >
          <img
            src={profileImage}
            alt={getContent('name') || 'Architect Profile'}
            loading="lazy"
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
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
            <Download size={16} />
            {t.about.download}
          </a>
        </motion.div>
      </div>

      {/* Philosophy Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-24 px-8 md:px-20 bg-white/[0.02] border border-white/5 rounded-[4rem] text-center mb-48"
      >
        <Quote className="text-[#d4a373]/20 mx-auto mb-10" size={80} />
        <p className="text-4xl md:text-6xl font-serif italic text-white/90 leading-tight max-w-4xl mx-auto">
          "{getContent('philosophy')}"
        </p>
      </motion.div>
    </div>
  );
};
