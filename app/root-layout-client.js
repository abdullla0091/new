"use client";

import React, { useEffect, useState } from 'react'
import Footer from '@/components/footer'
import TabBar from '@/components/tab-bar'
import TopNavBar from '@/components/top-nav-bar'
import { usePathname } from 'next/navigation'
import { useLanguage } from './i18n/LanguageContext'
import WelcomePopup from '@/components/welcome-popup'
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

// Component that uses the language context
export default function RootLayoutClient({ children }) {
  const pathname = usePathname()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  const isKurdish = language === 'ku'
  const isLandingPage = pathname === '/'
  const isChatPage = pathname.includes('/chat/')

  // Don't show footer on chat pages 
  const showFooter = !isChatPage;

  // Ensure hydration is complete before rendering theme-dependent elements
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn(
      "antialiased theme-container main-bg dark", 
      inter.className,
      isKurdish && "kurdish", // Add kurdish class when language is set to Kurdish
    )}>
      {!isLandingPage && <TopNavBar />}
      {isLandingPage ? (
        <div className={cn("flex flex-col min-h-screen mx-auto main-bg")}>
          <main className={cn("flex-grow w-full landing-page-main")}>
            {children}
          </main>
          {showFooter && <Footer />}
        </div>
      ) : (
        // Use gradient background for non-landing pages 
        <div className={cn("flex flex-col min-h-screen mx-auto md:pt-16 transition-colors duration-300 gradient-bg")}>
          {mounted && (
            <>
              {/* Theme-aware decorative elements */}
              <div className="absolute top-20 left-10 w-32 h-32 opacity-20 rounded-full blur-3xl"
                   style={{ background: 'var(--primary-color)' }}></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 opacity-20 rounded-full blur-3xl"
                   style={{ background: 'var(--primary-color)' }}></div>
            </>
          )}
          
          <main className="flex-grow overflow-y-auto w-full relative z-10">
            {children}
          </main>
          {showFooter && <Footer />}
          <TabBar />
        </div>
      )}
      <WelcomePopup />
    </div>
  );
} 