import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';
import { Language } from '../types/schema';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations.en;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('app_lang') as Language) || 'en');
  const isRtl = lang === 'ar';

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  const value = {
    lang,
    setLang,
    t: (translations as any)[lang] || translations.en,
    isRtl
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
};

