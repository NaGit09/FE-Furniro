"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "@/lib/locale/translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("EN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = window.requestAnimationFrame(() => {
      const savedLang = localStorage.getItem("furniro_language") as Language | null;
      if (savedLang === "VI" || savedLang === "EN") {
        setLanguageState(savedLang);
      }
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(handle);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("furniro_language", lang);
    // Custom event to sync across tabs/components if needed
    window.dispatchEvent(new Event("furniro_language_change"));
  };

  const t = (key: TranslationKey, variables?: Record<string, string | number>): string => {
    const dict = translations[language];
    let val = dict[key] || translations["EN"][key] || String(key);
    
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };

  // Prevent flashing during SSR hydration
  const value = {
    language: mounted ? language : "EN",
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
