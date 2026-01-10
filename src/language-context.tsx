import { createContext, useContext, useState, ReactNode } from "react";

/* ================= TYPES ================= */

export type Language = "ar" | "en" | "tr";

type Translations = Record<string, any>;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
  t: Translations;
}

/* ================= CONTEXT ================= */

const LanguageContext = createContext<LanguageContextType | null>(null);

/* ================= TRANSLATIONS ================= */
/* مؤقتة – لاحقًا يمكن فصلها لملفات */

const translations: Record<Language, Translations> = {
  ar: {
    footer: "العمارة تتعلق بالمعنى",
  },
  en: {
    footer: "Architecture is about meaning",
  },
  tr: {
    footer: "Mimarlık anlamla ilgilidir",
  },
};

/* ================= PROVIDER ================= */

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");

  const value: LanguageContextType = {
    lang,
    setLang,
    isRtl: lang === "ar",
    t: translations[lang] ?? {},
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useLang(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLang must be used within <LanguageProvider>");
  }
  return context;
}
