"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations as defaultTranslations } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isKurdish: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>(defaultTranslations.en);
  const isKurdish = language === "ku";

  useEffect(() => {
    // Set translations directly from the imported module
    setTranslations(defaultTranslations[language] || defaultTranslations.en);
    
    // Set HTML lang attribute for proper language indication
    document.documentElement.lang = language;
    
    // Apply Kurdish specific classes when Kurdish language is selected
    if (language === "ku") {
      document.documentElement.classList.add("kurdish");
      document.documentElement.classList.add("use-local-kurdish");
      document.documentElement.setAttribute("dir", "rtl");
      
      // Add special meta tag for better RTL support
      let metaRtl = document.querySelector('meta[name="viewport"]');
      if (metaRtl) {
        metaRtl.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0');
      }
    } else {
      document.documentElement.classList.remove("kurdish");
      document.documentElement.classList.remove("use-local-kurdish");
      document.documentElement.setAttribute("dir", "ltr");
      
      // Reset viewport meta
      let metaRtl = document.querySelector('meta[name="viewport"]');
      if (metaRtl) {
        metaRtl.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0');
      }
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

  // Improved translation function that handles mixed language content
  const t = (key: string): string => {
    const translation = translations[key] || key;
    
    // Return the translation without any special formatting
    // CSS rules will handle proper display based on direction
    return translation;
  };

  // Track which elements need language-specific classes
  useEffect(() => {
    // This function lets us add specific RTL support for certain elements
    function setupRTLSupport() {
      // Add classes to elements with arrow icons
      const arrowRightIcons = document.querySelectorAll('svg[data-lucide="arrow-right"], .lucide-arrow-right');
      const arrowLeftIcons = document.querySelectorAll('svg[data-lucide="arrow-left"], .lucide-arrow-left');
      
      arrowRightIcons.forEach(icon => {
        icon.classList.add('arrow-right');
      });
      
      arrowLeftIcons.forEach(icon => {
        icon.classList.add('arrow-left');
      });
      
      // Find any numbers/digits and apply the appropriate class
      const numberElements = document.querySelectorAll('.counter-effect, .number');
      numberElements.forEach(el => {
        el.classList.add('digit');
      });
    }
    
    // Apply these changes after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setupRTLSupport();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isKurdish }}>
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