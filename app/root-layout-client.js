"use client";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import TabBar from "@/components/tab-bar";
import TopNavBar from "@/components/top-nav-bar";
import WelcomePopup from "@/components/welcome-popup";
import { usePathname } from "next/navigation";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import ThemeWrapper from "@/components/theme-wrapper";

const inter = Inter({ subsets: ["latin"] });

function RootLayoutClientInner({ children }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isLandingPage = pathname === '/';
  const isKurdish = language === 'ku';

  return (
    <div className={cn(
      "antialiased", 
      inter.className,
      isKurdish && "kurdish" // Add kurdish class when language is set to Kurdish
    )}>
      {!isLandingPage && <TopNavBar />}
      {isLandingPage ? (
        <div className={cn("flex flex-col min-h-screen mx-auto")}>
          <main className={cn("flex-grow overflow-y-auto w-full landing-page-main")}>
            {children}
          </main>
        </div>
      ) : (
        <ThemeWrapper>
          <div className={cn("flex flex-col min-h-screen mx-auto md:pt-16")}>
            <main className="flex-grow overflow-y-auto w-full">
              {children}
            </main>
            <TabBar />
          </div>
          <WelcomePopup />
        </ThemeWrapper>
      )}
    </div>
  );
}

export default function RootLayoutClient({ children }) {
  return (
    <LanguageProvider>
      <RootLayoutClientInner>{children}</RootLayoutClientInner>
    </LanguageProvider>
  );
} 