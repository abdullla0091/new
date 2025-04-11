"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"
import { getCurrentChatTheme, applyChatTheme } from "@/lib/chat-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Apply chat theme on mount
    const currentChatTheme = getCurrentChatTheme();
    applyChatTheme(currentChatTheme);

    // Apply the purple color scheme by default
    document.documentElement.classList.add('dark');

    // Listen for chat theme changes
    window.addEventListener('chat-theme-changed', handleChatThemeChange);
    
    return () => {
      window.removeEventListener('chat-theme-changed', handleChatThemeChange);
    }
  }, [])

  // Handle chat theme changes
  const handleChatThemeChange = () => {
    const currentChatTheme = getCurrentChatTheme();
    applyChatTheme(currentChatTheme);
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

