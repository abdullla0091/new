"use client";

import { useLanguage } from "@/app/i18n/LanguageContext";
import LanguageToggle from "@/components/language-toggle";

export default function FontTestPage() {
  const { language } = useLanguage();
  const isKurdish = language === "ku";

  const exampleText = {
    en: "The quick brown fox jumps over the lazy dog.",
    ku: "ڕێنووسی کوردی وەک داهێنانێکی زمانەوانی دادەنرێت."
  };

  const title = {
    en: "Kurdish Font Test Page",
    ku: "پەڕەی تاقیکردنەوەی فۆنتی کوردی"
  };

  const subHeading = {
    en: "This page demonstrates different Kurdish font options",
    ku: "ئەم پەڕەیە شێوازە جیاوازەکانی فۆنتی کوردی نیشان دەدات"
  };

  const fontDescriptions = {
    en: {
      local: "Local Kurdish Font: Our custom Kurdish font",
      vazirmatn: "Vazirmatn: A modern, clean and readable font for Kurdish",
      amiri: "Amiri: A classical font with an elegant style",
      noto: "Noto Sans Arabic: A versatile and widely compatible font"
    },
    ku: {
      local: "فۆنتی کوردی لۆکاڵ: فۆنتی کوردی تایبەتمەندی ئێمە",
      vazirmatn: "ڤەزیرمەتن: فۆنتێکی مۆدێرن و خوێندنەوەیەکی ئاسان بۆ کوردی",
      amiri: "ئامیری: فۆنتێکی کلاسیکی بە شێوازێکی ناسک",
      noto: "نۆتۆ سانس عەرەبی: فۆنتێکی فرەلایەن و بەرفراوان"
    }
  };

  return (
    <div className={`min-h-screen p-8 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{title[language as keyof typeof title]}</h1>
          <LanguageToggle />
        </div>
        
        <p className="text-xl mb-12">{subHeading[language as keyof typeof subHeading]}</p>
        
        <div className="space-y-12">
          {/* Local Kurdish Font */}
          <div className="bg-indigo-900/30 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 use-local-kurdish">
              {fontDescriptions[language as keyof typeof fontDescriptions].local}
            </h2>
            <div className="grid gap-4">
              <div className="use-local-kurdish text-lg">
                <p className="mb-2">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-xl">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-2xl">{exampleText[language as keyof typeof exampleText]}</p>
              </div>
            </div>
          </div>
          
          {/* Vazirmatn Font */}
          <div className="bg-indigo-900/30 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 use-vazirmatn">
              {fontDescriptions[language as keyof typeof fontDescriptions].vazirmatn}
            </h2>
            <div className="grid gap-4">
              <div className="use-vazirmatn text-lg">
                <p className="mb-2">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-xl">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-2xl">{exampleText[language as keyof typeof exampleText]}</p>
              </div>
            </div>
          </div>
          
          {/* Amiri Font */}
          <div className="bg-purple-900/30 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 use-amiri">
              {fontDescriptions[language as keyof typeof fontDescriptions].amiri}
            </h2>
            <div className="grid gap-4">
              <div className="use-amiri text-lg">
                <p className="mb-2">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-xl">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-2xl">{exampleText[language as keyof typeof exampleText]}</p>
              </div>
            </div>
          </div>
          
          {/* Noto Sans Arabic Font */}
          <div className="bg-indigo-800/30 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
              {fontDescriptions[language as keyof typeof fontDescriptions].noto}
            </h2>
            <div className="grid gap-4">
              <div className="text-lg" style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}>
                <p className="mb-2">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-xl">{exampleText[language as keyof typeof exampleText]}</p>
                <p className="mb-2 text-2xl">{exampleText[language as keyof typeof exampleText]}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-indigo-900/20 p-6 rounded-xl">
          <p className="text-lg">
            {isKurdish ? 
              "تاقیکردنەوەی زیاتری فۆنتەکان و شێوازی نووسین بۆ دڵنیابوون لە خوێندنەوەیەکی باش و ڕێکوپێک بۆ کوردی سۆرانی." :
              "Additional font testing and text styling to ensure good readability and proper rendering for Kurdish Sorani."
            }
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-purple-400 hover:underline">
            {isKurdish ? "گەڕانەوە بۆ پەڕەی سەرەکی" : "Return to Home Page"}
          </a>
        </div>
      </div>
    </div>
  );
} 