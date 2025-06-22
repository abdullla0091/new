"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

export default function LanguagePage() {
  const router = useRouter();
  const { language, setLanguage, isKurdish } = useLanguage();
  const { toast } = useToast();
  
  const handleLanguageChange = (newLanguage: 'en' | 'ku') => {
    setLanguage(newLanguage);
    
    // Show toast based on selected language
    const toastTitle = newLanguage === 'en' ? "Language Changed" : "زمان گۆڕدرا";
    const toastDesc = newLanguage === 'en' 
      ? "Language set to English" 
      : "زمان گۆڕدرا بۆ کوردی";
    
    toast({
      title: toastTitle,
      description: toastDesc,
      duration: 2000,
    });
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full text-white hover:bg-white/10 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "زمان" : "Language"}
        </h1>
      </div>
      
      {/* Language Options */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <Globe className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "زمانی ئەپڵیکەیشنەکە هەڵبژێرە" : "Select application language"}
              </p>
            </div>
          </div>
          
          {/* English Option */}
          <div 
            className={`flex items-center justify-between p-4 hover:bg-indigo-800/50 cursor-pointer transition-colors ${isKurdish ? 'flex-row-reverse' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full bg-indigo-700/70 flex items-center justify-center ${isKurdish ? 'ml-4' : 'mr-4'}`}>
                <span className="text-sm font-semibold">EN</span>
              </div>
              <span className="text-base">English</span>
            </div>
            {language === 'en' && <Check className="h-5 w-5 text-green-400" />}
          </div>
          
          {/* Kurdish Option */}
          <div 
            className={`flex items-center justify-between p-4 hover:bg-indigo-800/50 cursor-pointer transition-colors ${isKurdish ? 'flex-row-reverse' : ''}`}
            onClick={() => handleLanguageChange('ku')}
          >
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full bg-indigo-700/70 flex items-center justify-center ${isKurdish ? 'ml-4' : 'mr-4'}`}>
                <span className="text-sm font-semibold">KU</span>
              </div>
              <span className="text-base kurdish use-local-kurdish">کوردی</span>
            </div>
            {language === 'ku' && <Check className="h-5 w-5 text-green-400" />}
          </div>
        </div>
        
        {/* Language Description */}
        <div className="mt-4 bg-indigo-900/50 backdrop-blur-md p-4 rounded-2xl border border-purple-500/20">
          <p className={`text-sm text-purple-200 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
            {isKurdish 
              ? "گۆڕینی زمان کاریگەری دەبێت لەسەر هەموو دەقەکانی ئەپڵیکەیشنەکە. دەتوانیت هەر کاتێک بتەوێت زمانەکە بگۆڕیت."
              : "Changing the language affects all text in the application. You can change the language at any time."}
          </p>
        </div>
      </div>
    </div>
  );
} 