"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function LanguageSettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage, isKurdish } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (newLanguage: "en" | "ku") => {
    setLanguage(newLanguage);
    
    toast({
      title: newLanguage === 'en' ? "Language Updated" : "زمان نوێ کرایەوە",
      description: newLanguage === 'en' 
        ? `App language set to English` 
        : `زمانی ئەپڵیکەشن گۆڕدرا بۆ کوردی`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className={cn("rounded-full text-white hover:bg-white/10", isKurdish ? "ml-2" : "mr-2")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "زمان" : "Language"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 flex-1">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="p-4 border-b border-purple-500/20">
            <p className={cn("text-sm text-purple-300", isKurdish && "text-right")}>
              {isKurdish ? "زمانی ئەپڵیکەیشن هەڵبژێرە" : "Choose application language"}
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* English Option */}
            <div 
              className={cn(
                "relative rounded-lg border p-4 cursor-pointer transition-all",
                language === "en" 
                  ? "ring-2 ring-purple-500 border-purple-500" 
                  : "border-purple-500/30 hover:border-purple-400",
              )}
              onClick={() => handleLanguageChange("en")}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">English</span>
                {language === "en" && (
                  <div className="bg-purple-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Kurdish Option */}
            <div 
              className={cn(
                "relative rounded-lg border p-4 cursor-pointer transition-all",
                language === "ku" 
                  ? "ring-2 ring-purple-500 border-purple-500" 
                  : "border-purple-500/30 hover:border-purple-400",
              )}
              onClick={() => handleLanguageChange("ku")}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-white kurdish">کوردی</span>
                {language === "ku" && (
                  <div className="bg-purple-500 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Text */}
        <div className="mt-4 p-4 bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
          <p className={cn("text-sm text-purple-300", isKurdish && "text-right")}>
            {isKurdish 
              ? "گۆڕینی زمان کاریگەری هەیە لەسەر هەموو دەقەکانی ئەپڵیکەیشنەکە."
              : "Changing the language affects all text throughout the application."}
          </p>
        </div>
      </div>
    </div>
  );
} 