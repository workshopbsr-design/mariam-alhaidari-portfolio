import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../language-context';
import { ArrowRight, Fingerprint } from 'lucide-react';

export const Home = ({ onNavigate, info }: any) => {
  const { lang } = useLang();

  /* ================= CONTENT MODEL ================= */
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
      en: 'View Selected Works',
      ar: 'عرض الأعمال المختارة',
      tr: 'Seçili Projeler',
    },
    dnaTitle: {
      en: 'Design DNA',
      ar: 'الهوية التصميمية',
      tr: 'Tasarım DNA',
    },
    dna: {
      en: [
        {
          title: 'Context First',
          desc: 'Architecture is not an object; it is a response to its environment.',
        },
        {
          title: 'Human-Centered',
          desc: 'Spaces are shaped by emotions, not only by dimensions.',
        },
        {
          title: 'Clarity Over Complexity',
          desc: 'Eliminating the unnecessary to reveal the essential.',
        },
      ],
      ar: [
        {
          title: 'السياق أولاً',
          desc: 'العمارة ليست كياناً منفصلاً بل استجابة للمكان.',
        },
        {
          title: 'الإنسان أولاً',
          desc: 'الفراغات تُبنى على الإحساس لا على الأبعاد فقط.',
        },
        {
          title: 'الوضوح قبل التعقيد',
          desc: 'إزالة الزائد لإبراز الجوهر.',
        },
      ],
      tr: [
        {
          title: 'Bağlam Öncelikli',
          desc: 'Mimarlık bir nesne değil, çevresine verilen bir yanıttır.',
        },
        {
          title: 'İnsan Odaklı',
          desc: 'Mekanlar ölçülerle değil, duygularla şekillenir.',
        },
        {
          title: 'Sadelik',
          desc: 'Gereksizi kaldırarak özü ortaya çıkarmak.',
        },
      ],
    },
  };

  const architectName =
    (lang === 'ar'
      ? info?.nameAr
      : lang === 'tr'
      ? info?.nameTr
      : info?.nameEn) || 'Atelier';

  /* ================= RENDER ================= */
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 overflow-hidden">
        {/* Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Architectural Interior"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Role */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#d4a373]/30
                       text-[#d4a373] text-[10px] uppercase tracking-[0.4em] bg-black/30"
          >
            {hero.role[lang]}
          </motion.span>

          {/* Name */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-serif text-[9vw] md:text-[5rem] lg:text-[6.2rem]
                       leading-[0.9] text-white mb-6"
          >
            {architectName}
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-serif italic text-lg md:text-3xl text-white/60 mb-8"
          >
            {hero.title[lang]}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="max-w-2xl mx-auto text-sm md:text-lg text-white/80 font-light mb-14"
          >
            {hero.sub[lang]}
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            onClick={() => onNavigate('projects')}
            className="mx-auto flex items-center gap-4 bg-[#E3D4B6] text-black
                       px-10 py-5 rounded-full text-xs font-serif font-bold
                       tracking-widest hover:scale-105 transition-all"
          >
            {hero.cta[lang]}
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* ================= DESIGN DNA ================= */}
      <section className="relative bg-black px-6 md:px-20 py-40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="flex justify-center items-center mb-20
                            text-[#d4a373] text-[10px] uppercase tracking-[0.4em] gap-2">
              <Fingerprint size={14} />
              {hero.dnaTitle[lang]}
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              {hero.dna[lang].map((item, idx) => (
                <div
                  key={idx}
                  className="border-l border-white/10 pl-8
                             rtl:pl-0 rtl:pr-8 rtl:border-l-0 rtl:border-r"
                >
                  <h3 className="font-serif italic text-xl text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
