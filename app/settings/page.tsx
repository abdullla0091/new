"use client" // For client-side state and theme handling

import { useState, useEffect } from "react";
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
  Sun,
  Paintbrush,
  Globe,
  Lock,
  HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";

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

// Setting item component
const SettingItem = ({ 
  icon, 
  title, 
  description, 
  path, 
  isKurdish 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  path: string;
  isKurdish: boolean;
}) => {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.push(path)}
      className="w-full flex items-center justify-between p-4 text-left border-b border-purple-500/20 last:border-0 hover:bg-indigo-800/30 transition-colors"
      dir={isKurdish ? "rtl" : "ltr"}
    >
      <div className="flex items-center">
        <div className={cn("text-purple-300", isKurdish ? "ml-3" : "mr-3")}>
          {icon}
        </div>
        <div>
          <p className={cn("text-base font-medium", isKurdish && "kurdish use-local-kurdish")}>
            {title}
          </p>
          <p className={cn("text-xs text-purple-300 mt-1", isKurdish && "kurdish use-local-kurdish")}>
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className={cn("h-5 w-5 text-purple-300", isKurdish && "transform rotate-180")} />
    </button>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [language, setLanguage] = useState('en'); // Default language
  const [mounted, setMounted] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const { isKurdish } = useLanguage();

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

  // Settings data with both languages
  const settings = [
    {
      icon: <Paintbrush className="h-5 w-5" />,
      titleEn: "Chat Themes",
      titleKu: "ڕووکاری چات",
      descriptionEn: "Customize chat background and colors",
      descriptionKu: "ڕووکاری چات و ڕەنگەکانی دەستکاری بکە",
      path: "/appearance"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      titleEn: "Language",
      titleKu: "زمان",
      descriptionEn: "Change application language",
      descriptionKu: "گۆڕینی زمانی بەرنامە",
      path: "/settings/language"
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      titleEn: "Privacy Policy",
      titleKu: "سیاسەتی تایبەتمەندی",
      descriptionEn: "Review our privacy practices",
      descriptionKu: "پێداچوونەوە بۆ شێوازەکانی تایبەتمەندیمان",
      path: "/privacy-policy"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      titleEn: "Terms of Service",
      titleKu: "مەرجەکانی خزمەتگوزاری",
      descriptionEn: "Review our terms and conditions",
      descriptionKu: "پێداچوونەوە بۆ مەرج و ڕێساکانمان",
      path: "/terms"
    },
    {
      icon: <Info className="h-5 w-5" />,
      titleEn: "About",
      titleKu: "دەربارە",
      descriptionEn: "Information about ChatKurd",
      descriptionKu: "زانیاری دەربارەی چاتکورد",
      path: "/about"
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      titleEn: "Help & FAQ",
      titleKu: "یارمەتی",
      descriptionEn: "Get help and frequently asked questions",
      descriptionKu: "یارمەتی و پرسیارە دووبارەکان وەربگرە",
      path: "/help"
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`} dir={isKurdish ? "rtl" : "ltr"}>
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
          {isKurdish ? "ڕێکخستنەکان" : "Settings"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          {settings.map((setting, index) => (
            <SettingItem 
              key={index}
              icon={setting.icon}
              title={isKurdish ? setting.titleKu : setting.titleEn}
              description={isKurdish ? setting.descriptionKu : setting.descriptionEn}
              path={setting.path}
              isKurdish={isKurdish}
            />
          ))}
        </div>
        
        {/* Contact Support */}
        <div className="mt-6">
          <Button 
            onClick={() => router.push('/contact')}
            className="w-full bg-indigo-800/50 hover:bg-indigo-700/50 text-white border border-purple-500/30 rounded-lg p-3"
          >
            {isKurdish ? "پەیوەندیمان پێوە بکە" : "Contact Support"}
          </Button>
        </div>
        
        {/* App Version */}
        <div className="mt-8 text-center">
          <p className="text-xs text-purple-400">
            {isKurdish ? "چاتکورد وەشانی ١.٠.٠" : "ChatKurd Version 1.0.0"}
          </p>
        </div>
      </div>
    </div>
  );
}
