"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Star, User, Sparkles, Bell, Globe, Settings } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext"
import Link from "next/link"
import { cn } from "@/lib/utils"
import LanguageToggle from "./language-toggle"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function TopNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, t, setLanguage } = useLanguage()
  const isKurdish = language === "ku"
  const [scrolled, setScrolled] = useState(false)
  
  // Track scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle language toggle
  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "ku" : "en")
  }

  const tabs = [
    { name: t("home"), path: "/home", icon: Home },
    { name: t("explore"), path: "/explore", icon: Search },
    { name: t("create"), path: "/custom-characters", icon: () => <Sparkles className="h-5 w-5" /> },
    { name: t("favorites"), path: "/favorites", icon: () => <Star className="h-5 w-5" /> },
    { name: t("profile"), path: "/profile", icon: User },
  ]

  return (
    <div 
      className={cn(
        "hidden md:block fixed top-0 left-0 right-0 backdrop-blur-lg border-b border-purple-500/20 z-50 transition-all duration-300",
        scrolled ? "shadow-[0_4px_30px_rgba(139,92,246,0.2)] h-14" : "h-16",
        isKurdish ? 'kurdish' : ''
      )}
    >
      <div className="w-full mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
            <div className="relative h-14 w-14">
              <Image 
                src="/images/logoo.png" 
                alt="Nestro Chat Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              Nestro Chat
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex gap-1 sm:gap-2 md:gap-4">
            {tabs.map((tab) => {
              const isActive = tab.path === "/home" 
                ? pathname === "/home" 
                : pathname.startsWith(tab.path)

              return (
                <Link
                  key={tab.name}
                  href={tab.path}
                  className={cn(
                    "relative flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-all duration-200 hover:scale-105",
                    isActive 
                      ? "bg-purple-600/30 text-white font-medium shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                      : "text-gray-200 hover:bg-indigo-800/30 hover:text-white"
                  )}
                >
                  {typeof tab.icon === "function" ? <tab.icon /> : <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                  <span className="hidden sm:inline">{tab.name}</span>
                  
                  {/* Notification dot for profile */}
                  {tab.name === t("profile") && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative p-1.5 rounded-full hover:bg-indigo-800/30 transition-colors">
              <Bell className="h-5 w-5 text-gray-200" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Settings */}
            <Link href="/settings" className="p-1.5 rounded-full hover:bg-indigo-800/30 transition-colors">
              <Settings className="h-5 w-5 text-gray-200" />
            </Link>
            
            {/* Language toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 text-white hover:bg-indigo-800/30 rounded-md transition-all duration-200"
            >
              <Globe className="h-4 w-4 text-purple-300" />
              <span className="text-gray-200">{language.toUpperCase()}</span>
            </Button>
            
            <Link href="/auth/signin">
              <button className="py-1.5 px-4 bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 text-sm font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105">
                {t("signIn")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 