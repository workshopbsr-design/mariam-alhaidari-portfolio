
import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../language-context';
import { Download, Award, PenTool, Layout, Terminal } from 'lucide-react';

export const About = ({ info }: { info: any }) => {
  const { t, lang } = useLang();

  const data = info || {
    nameEn: "Mariam Al-Haidari", nameAr: "مريم الحيدري", nameTr: "Mariam Al-Haidari",
    profileImage: "",
    resumeUrl: "",
    bioEn: "", bioAr: "", bioTr: "",
    philosophyEn: "", philosophyAr: "", philosophyTr: "",
    beliefEn: "", beliefAr: "", beliefTr: "",
    skillsEn: [], skillsAr: [], skillsTr: [],
    softSkillsEn: [], softSkillsAr: [], softSkillsTr: []
  };

  const getContent = (key: string) => {
    // @ts-ignore
    return lang === 'ar' ? data[`${key}Ar`] : (lang === 'tr' ? data[`${key}Tr`] : data[`${key}En`]);
  };

  const architectName = (lang === 'ar' ? data.nameAr : (lang === 'tr' ? data.nameTr : data.nameEn)) || (lang === 'ar' ? 'مريم الحيدري' : 'Mariam Al-Haidari');

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-10 md:gap-16 items-start mb-24 md:mb-32"
      >
        <div className="relative aspect-[3/4] bg-white/5 rounded-sm overflow-hidden">
            <img 
                src={data.profileImage} 
                alt="Architect Profile" 
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
        </div>
        <div>
            <span className="text-[#d4a373] text-[10px] uppercase tracking-[0.4em] block mb-4 md:mb-6">{t.about.bioTitle}</span>
            <h1 className="text-4xl md:text-5xl font-serif italic mb-6 md:mb-8 leading-tight">
                {architectName}
            </h1>
            <p className="text-base md:text-lg text-white/70 font-light leading-relaxed mb-8 md:mb-10 whitespace-pre-line">
                {getContent('bio')}
            </p>
            
            <a 
                href={data.resumeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-white/20 px-8 py-4 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all group w-full md:w-auto justify-center cursor-pointer"
                onClick={(e) => {
                    if(!data.resumeUrl) {
                        e.preventDefault();
                        alert(lang === 'ar' ? 'لم يتم إضافة رابط الملف بعد' : (lang === 'tr' ? 'Henüz portföy dosyası eklenmedi' : 'No portfolio file linked yet'));
                    }
                }}
            >
                <Download size={16} />
                {t.about.download}
            </a>
        </div>
      </motion.div>

      {/* Philosophy Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-24 md:mb-32 border-l-2 border-[#d4a373] pl-6 md:pl-12 py-4"
      >
        <h2 className="text-2xl md:text-3xl font-serif italic mb-4 md:mb-6">{t.about.philosophyTitle}</h2>
        <p className="text-lg md:text-2xl font-light leading-relaxed text-white/80 mb-6">
            "{getContent('philosophy')}"
        </p>
        <p className="text-sm md:text-base font-medium text-[#d4a373] tracking-wide opacity-90">
            {getContent('belief')}
        </p>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
            <h3 className="flex items-center gap-3 text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-6 md:mb-8 pb-4 border-b border-white/10">
                <PenTool size={16} /> {t.about.skillsTitle}
            </h3>
            <ul className="space-y-4">
                {getContent('skills')?.map((skill: string, idx: number) => (
                    <li key={idx} className="flex justify-between items-center group">
                        <span className="font-light text-base md:text-lg">{skill}</span>
                        <div className="h-[1px] bg-white/10 flex-1 mx-4 group-hover:bg-[#d4a373] transition-colors"></div>
                        <span className="text-[10px] text-white/30">0{idx + 1}</span>
                    </li>
                ))}
            </ul>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
            <h3 className="flex items-center gap-3 text-[#d4a373] text-xs uppercase tracking-[0.3em] mb-6 md:mb-8 pb-4 border-b border-white/10">
                <Layout size={16} /> {lang === 'ar' ? 'المهارات الشخصية' : (lang === 'tr' ? 'Yönetim Becerileri' : 'Management & Strategy')}
            </h3>
            <div className="flex flex-wrap gap-3">
                {getContent('softSkills')?.map((skill: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs text-white/70">
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
      </div>
    </div>
  );
};
