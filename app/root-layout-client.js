"use client";

import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import TabBar from "@/components/tab-bar";
import TopNavBar from "@/components/top-nav-bar";
import WelcomePopup from "@/components/welcome-popup";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "./i18n/LanguageContext";
import ThemeWrapper from "@/components/theme-wrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <LanguageProvider>
      <div className={cn("antialiased", inter.className)}>
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
    </LanguageProvider>
  );
} 