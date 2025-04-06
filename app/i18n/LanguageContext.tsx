"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations as defaultTranslations } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations.en);

  useEffect(() => {
    // Set translations directly from the imported module
    setTranslations(defaultTranslations[language] || defaultTranslations.en);
    
    // Set HTML lang attribute for proper language indication
    document.documentElement.lang = language;
    
    // Simpler approach: Toggle a single class based on language
    if (language === "ku") {
      document.documentElement.classList.add("kurdish");
    } else {
      document.documentElement.classList.remove("kurdish");
    }
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ku")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 