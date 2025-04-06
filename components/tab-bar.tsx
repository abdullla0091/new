"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Star, User, Sparkles } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext"

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language, t } = useLanguage()
  const isKurdish = language === "ku"
  
  // Define tab labels
  const tabLabels = {
    home: isKurdish ? "سەرەکی" : "Home",
    explore: isKurdish ? "گەڕان" : "Explore",
    create: isKurdish ? "دروستکردن" : "Create",
    favorites: isKurdish ? "دڵخوازەکان" : "Favorites",
    profile: isKurdish ? "پرۆفایل" : "Profile"
  }

  const tabs = [
    { name: t("home"), path: "/home", icon: Home },
    { name: t("explore"), path: "/explore", icon: Search },
    { name: t("create"), path: "/custom-characters", icon: () => <Sparkles className="h-6 w-6" /> },
    { name: t("favorites"), path: "/favorites", icon: () => <Star className="h-6 w-6" /> },
    { name: t("profile"), path: "/profile", icon: User },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-lg bg-indigo-950/70 border-t border-purple-500/20 md:hidden shadow-[0_-4px_30px_rgba(139,92,246,0.2)] ${isKurdish ? 'use-local-kurdish' : ''}`}>
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = tab.path === "/home" ? pathname === "/home" : pathname.startsWith(tab.path)

          return (
            <button
              key={tab.name}
              className={`flex flex-col items-center py-2 px-4 flex-1 focus:outline-none focus:ring-0 transition-colors ${
                isActive 
                  ? "text-purple-400 bg-purple-600/20" 
                  : "text-gray-300 hover:text-purple-300 hover:bg-indigo-800/20"
              }`}
              onClick={() => router.push(tab.path)}
            >
              {typeof tab.icon === "function" ? <tab.icon /> : <tab.icon className="h-6 w-6" />}
              <span className="text-xs mt-1">{tab.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

