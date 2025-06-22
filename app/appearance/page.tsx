"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { chatThemes, getCurrentChatTheme, setChatTheme, getChatThemeById, ChatTheme } from "@/lib/chat-themes";
import { cn } from "@/lib/utils";

export default function ChatThemePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { language, isKurdish } = useLanguage();
  const { toast } = useToast();
  const [selectedChatTheme, setSelectedChatTheme] = useState<string>(getCurrentChatTheme());
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleChatThemeChange = (themeId: string) => {
    setSelectedChatTheme(themeId);
    setChatTheme(themeId);
    
    // Get theme option
    const themeOption = getChatThemeById(themeId);
    
    if (themeOption) {
      // Show toast
      toast({
        title: isKurdish ? "ڕەنگی چات گۆڕدرا" : "Chat Theme Changed",
        description: isKurdish 
          ? `ڕەنگی چات گۆڕدرا بۆ ${themeOption?.name}`
          : `Chat theme changed to ${themeOption?.name}`,
        duration: 2000,
      });
    }
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
          {isKurdish ? "ڕەنگی چات" : "Chat Theme"}
        </h1>
      </div>
      
      {/* Chat Theme Options */}
      <div className="px-4 py-6 space-y-8">
        <div>
          <h2 className={cn("text-lg font-semibold mb-4 text-purple-300", isKurdish && "text-right")}>
            {isKurdish ? "ڕەنگی چات" : "Chat Theme"}
          </h2>
          
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-4 border-b border-purple-500/20">
              <p className={cn("text-sm text-purple-300", isKurdish && "text-right")}>
                {isKurdish ? "ڕەنگی چاتت هەڵبژێرە" : "Choose your chat background theme"}
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              {chatThemes.map((themeOption: ChatTheme) => (
                <div 
                  key={themeOption.id}
                  className={cn(
                    "relative rounded-lg border p-4 cursor-pointer transition-all",
                    selectedChatTheme === themeOption.id 
                      ? "ring-2 ring-purple-500 border-purple-500" 
                      : "border-purple-500/30 hover:border-purple-400",
                  )}
                  onClick={() => handleChatThemeChange(themeOption.id)}
                >
                  {/* Chat preview */}
                  <div className="flex flex-col space-y-2">
                    {/* Theme name */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{themeOption.name}</span>
                      {selectedChatTheme === themeOption.id && (
                        <div className="bg-purple-500 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Chat preview */}
                    <div 
                      className="w-full h-24 rounded-lg p-2 flex flex-col justify-between"
                      style={{ background: themeOption.colors.background }}
                    >
                      {/* Bot message preview */}
                      <div 
                        className="self-start rounded-lg px-3 py-1 max-w-[70%] text-xs"
                        style={{ 
                          background: themeOption.colors.messageBot,
                          color: themeOption.colors.textDark
                        }}
                      >
                        {isKurdish ? "چۆنی؟" : "Hello there!"}
                      </div>
                      
                      {/* User message preview */}
                      <div 
                        className="self-end rounded-lg px-3 py-1 max-w-[70%] text-xs"
                        style={{ 
                          background: themeOption.colors.messageUser,
                          color: themeOption.colors.textLight
                        }}
                      >
                        {isKurdish ? "باشم، سوپاس" : "I'm good, thanks!"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Theme Help Text */}
          <div className="mt-4 p-4 bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
            <p className={cn("text-sm text-purple-300", isKurdish && "text-right")}>
              {isKurdish 
                ? "گۆڕینی ڕەنگی چات تەنها کاریگەری دەبێت لەسەر ڕەنگی پاشبنەمای چات و پەیامەکان."
                : "Changing the chat theme only affects the background of the chat area and message colors."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 