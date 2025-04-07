"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import { ChatHistoryDialog } from "@/components/chat/chat-history-dialog"
import { Chat } from "@/types"

interface MainNavProps {
  className?: string
  chats?: Chat[]
}

export function MainNav({ className, chats = [] }: MainNavProps) {
  const pathname = usePathname()
  const [historyOpen, setHistoryOpen] = React.useState(false)
  
  const isChatPage = pathname.startsWith("/chat")
  const isExplore = pathname === "/"
  const isSettings = pathname === "/settings"
  const isAbout = pathname === "/about"
  
  return (
    <nav className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-semibold">ChatAI</span>
        </Link>
        <div className="hidden md:flex items-center space-x-1 ml-6">
          <Button 
            variant={isExplore ? "default" : "ghost"} 
            size="sm" 
            className="font-normal"
            asChild
          >
            <Link href="/">Explore</Link>
          </Button>
          <Button 
            variant={isChatPage ? "default" : "ghost"} 
            size="sm"
            className="font-normal"
            asChild
          >
            <Link href={chats.length > 0 ? `/chat/${chats[0].id}` : "/explore"}>
              Chat
            </Link>
          </Button>
          <Button 
            variant={isSettings ? "default" : "ghost"} 
            size="sm"
            className="font-normal"
            asChild
          >
            <Link href="/settings">Settings</Link>
          </Button>
          <Button 
            variant={isAbout ? "default" : "ghost"} 
            size="sm"
            className="font-normal"
            asChild
          >
            <Link href="/about">About</Link>
          </Button>
        </div>
      </div>
      <ThemeToggle variant="button" />
      {chats.length > 0 && (
        <ChatHistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          chats={chats}
        />
      )}
    </nav>
  )
} 