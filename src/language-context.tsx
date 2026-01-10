import { createContext, useContext, useState, ReactNode } from "react";

/* ================= TYPES ================= */

export type Language = "ar" | "en" | "tr";

interface Translations {
  hero?: any;
  footer?: any;
  [key: string]: any;
}

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
  t: Translations;
}

/* ================= CONTEXT ================= */

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/* ================= TRANSLATIONS (PLACEHOLDER) ================= */
/* لاحقًا تربطينها بملفات ترجمة حقيقية */

const translations: Record<Language, Translations> = {
  ar: {},
  en: {},
  tr: {},
};

/* ================= PROVIDER ================= */

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  const isRtl = lang === "ar";
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return context;
}
