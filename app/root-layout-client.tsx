"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Chat } from "@/types"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useState(0)
  const [chats, setChats] = useState<Chat[]>([])
  
  // Get chats from server for the MainNav component
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chat')
        if (!response.ok) return
        const data = await response.json()
        setChats(data)
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      }
    }
    
    fetchChats()
  }, [])
  
  useEffect(() => {
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      
      // Set initial value
      handleResize()
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Don't show either navigation on the chat page for small screens
  if (pathname.startsWith('/chat/') && windowWidth < 768) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav className="hidden md:flex" chats={chats} />
          <MobileNav className="md:hidden" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
} 