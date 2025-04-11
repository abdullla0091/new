"use client"

import React from 'react'
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, PlusCircle, Heart, User, Info, Settings } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext"

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useLanguage()

  // Don't show the TabBar on chat pages
  if (pathname.startsWith('/chat/')) {
    return null
  }
  
  // Define tab labels
  const tabLabels = {
    home: { en: 'Home', ku: 'سەرەکی' },
    explore: { en: 'Explore', ku: 'گەڕان' },
    create: { en: 'Create', ku: 'دروستکردن' },
    favorites: { en: 'Favorites', ku: 'دڵخوازەکان' },
    profile: { en: 'Profile', ku: 'پرۆفایل' },
    settings: { en: 'Settings', ku: 'ڕێکخستنەکان' },
  }

  const tabs = [
    { id: 'home', path: '/home', icon: Home },
    { id: 'explore', path: '/explore', icon: Search },
    { id: 'create', path: '/create', icon: PlusCircle },
    { id: 'favorites', path: '/favorites', icon: Heart },
    { id: 'profile', path: '/profile', icon: User },
    { id: 'settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-lg bg-indigo-950/70 border-t border-purple-500/20 md:hidden shadow-[0_-4px_30px_rgba(139,92,246,0.2)] ${language === "ku" ? 'use-local-kurdish' : ''}`}>
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`)
          
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-4 flex-1 focus:outline-none focus:ring-0 transition-colors ${
                isActive 
                  ? "text-white" 
                  : "text-indigo-300 hover:text-white"
              }`}
              onClick={() => router.push(tab.path)}
            >
              <tab.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{tabLabels[tab.id as keyof typeof tabLabels][language as 'en' | 'ku']}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

