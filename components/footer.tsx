"use client"

import Link from "next/link"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Footer() {
  const { t, language } = useLanguage()
  const isKurdish = language === "ku"
  
  return (
    <footer className="w-full py-8 px-4 bg-indigo-950/50 backdrop-blur-md border-t border-purple-500/10 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="relative h-10 w-10">
              <Image 
                src="/images/logo.png" 
                alt="ChatKurd Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className={cn("font-display font-bold text-lg", isKurdish && "latin")}>Nestro Chat</span>
          </div>
          
          <div className={cn("flex gap-6 mb-6 md:mb-0", isKurdish && "flex-row-reverse")}>
            <Link 
              href="/privacy-policy" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isKurdish ? "تایبەتمەندی" : "Privacy"}
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isKurdish ? "مەرجەکان" : "Terms"}
            </Link>
            <Link 
              href="/about" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isKurdish ? "دەربارە" : "About"}
            </Link>
          </div>
          
          <div className={cn("text-gray-400 text-sm", isKurdish && "kurdish use-local-kurdish")}>
            {t("copyright")}
          </div>
        </div>
      </div>
    </footer>
  )
} 