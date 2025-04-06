"use client";

import { useLanguage } from "@/app/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ku" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-white hover:bg-indigo-800/30 rounded-md transition-all duration-200"
    >
      <Globe className="h-4 w-4 text-purple-300" />
      <span className="text-gray-200">{t("switchLanguage")}</span>
    </Button>
  );
} 