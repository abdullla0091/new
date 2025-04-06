"use client" // For client-side state and theme handling

import { useState, useEffect } from "react";
import ThemeToggle from "@/components/theme-toggle";
import ThemeSelector from "@/components/theme-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Palette, 
  Languages, 
  Info, 
  ShieldCheck, 
  FileText,
  ChevronRight,
  Moon,
  Sun 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

// Reusable SettingsItem component
function SettingsItem({
  icon,
  label,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-3 text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [language, setLanguage] = useState('en'); // Default language
  const [mounted, setMounted] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Ensure no hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    
    // Change the html lang attribute
    if (value === 'ku') {
      document.documentElement.lang = 'ku';
    } else {
      document.documentElement.lang = 'en';
    }
    
    toast({
      title: value === 'en' ? "Language Updated" : "زمان نوێ کرایەوە",
      description: value === 'en' 
        ? `App language set to English` 
        : `زمانی ئەپڵیکەشن گۆڕدرا بۆ کوردی`,
      duration: 2000,
    });
  };

  const handlePlaceholderClick = (settingName: string) => {
     toast({ title: "Placeholder", description: `${settingName} setting not implemented yet.`, duration: 1500 });
  }

  if (!mounted) {
    return null; // Avoid rendering until client-side to prevent hydration mismatch
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background">
       {/* Header */}
       <header className="flex items-center p-3 border-b dark:border-gray-700 sticky top-0 bg-background/95 backdrop-blur z-10">
        <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          {language === 'en' ? 'Settings' : <span className="kurdish">ڕێکخستنەکان</span>}
        </h1>
      </header>

      {/* Settings List */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto pb-20"> {/* Added padding-bottom for TabBar */}
        <SettingsItem
          icon={<Palette className="h-5 w-5 text-gray-500" />}
          label={language === 'en' ? "Appearance" : <span className="kurdish">ڕووکار</span>}
          onClick={() => setShowThemeSelector(!showThemeSelector)}
        >
          <div className="flex items-center">
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-gray-500 mr-2" />
            ) : (
              <Sun className="h-4 w-4 text-gray-500 mr-2" />
            )}
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </SettingsItem>

        {/* Display theme selector when expanded */}
        {showThemeSelector && (
          <div className="mx-4 mb-2">
            <ThemeSelector />
          </div>
        )}

        <SettingsItem
          icon={<Languages className="h-5 w-5 text-gray-500" />}
          label={language === 'en' ? "Language" : <span className="kurdish">زمان</span>}
        >
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={language === 'en' ? "Select language" : "هەڵبژاردنی زمان"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ku" className="font-kurdish">کوردی</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>

        <Separator />

        <SettingsItem
          icon={<Info className="h-5 w-5 text-gray-500" />}
          label={language === 'en' ? "About" : <span className="kurdish">دەربارە</span>}
        >
           <Button variant="ghost" size="sm" onClick={() => handlePlaceholderClick('About')}>
             {language === 'en' ? "View" : <span className="kurdish">بینین</span>}
           </Button>
        </SettingsItem>

         <SettingsItem
          icon={<ShieldCheck className="h-5 w-5 text-gray-500" />}
          label={language === 'en' ? "Privacy Policy" : <span className="kurdish">سیاسەتی تایبەتمەندی</span>}
        >
           <Button variant="ghost" size="sm" onClick={() => handlePlaceholderClick('Privacy Policy')}>
             {language === 'en' ? "View" : <span className="kurdish">بینین</span>}
           </Button>
        </SettingsItem>

         <SettingsItem
          icon={<FileText className="h-5 w-5 text-gray-500" />}
          label={language === 'en' ? "Terms of Service" : <span className="kurdish">مەرجەکانی خزمەتگوزاری</span>}
        >
           <Button variant="ghost" size="sm" onClick={() => handlePlaceholderClick('Terms of Service')}>
             {language === 'en' ? "View" : <span className="kurdish">بینین</span>}
           </Button>
        </SettingsItem>

      </div>
    </div>
  );
}
