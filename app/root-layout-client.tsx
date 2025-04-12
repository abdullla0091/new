"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { Chat } from "@/types"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useState(0)
  const [chats, setChats] = useState<Chat[]>([])
  const { language } = useLanguage()
  const isKurdish = language === "ku"
  
  // Get chats from server for the MainNav component
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat')
        if (!response.ok) {
          console.error('Failed to fetch chats: API returned status', response.status);
          return;
        }
        
        const data = await response.json()
        setChats(data)
      } catch (error) {
        console.error('Failed to fetch chats:', error)
        // Return empty array to prevent UI errors
        setChats([])
      }
    }
    
    fetchChats()
  }, [])
  
  useEffect(() => {
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
        
        // Set a custom property for viewport height that will be used instead of 100vh
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      // Set initial value
      handleResize()
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('orientationchange', handleResize)
      }
    }
  }, [])
  
  // Don't show navigation on the chat page for small screens
  if (pathname.startsWith('/chat/') && windowWidth < 768) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  )
} 