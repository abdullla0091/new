"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"
import { getCurrentTheme, getThemeById, THEME_STORAGE_KEY } from "@/lib/themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Apply theme colors as CSS variables on mount
    applyThemeColors()

    // Listen for theme changes
    window.addEventListener('theme-changed', applyThemeColors)
    
    return () => {
      window.removeEventListener('theme-changed', applyThemeColors)
    }
  }, [])

  // Function to apply theme colors to root element
  const applyThemeColors = () => {
    try {
      if (typeof window === 'undefined') return

      const themeId = getCurrentTheme()
      
      // Skip applying theme colors if using system theme
      if (themeId === 'system') return
      
      const themeOption = getThemeById(themeId)
      if (!themeOption) return
      
      // Apply colors to :root and html element
      const root = document.documentElement
      
      // Apply main colors
      root.style.setProperty('--background', themeOption.colors.background)
      root.style.setProperty('--foreground', themeOption.colors.foreground)
      
      // Card and borders
      root.style.setProperty('--card', themeOption.colors.card)
      root.style.setProperty('--card-foreground', themeOption.colors.foreground)
      root.style.setProperty('--border', themeOption.colors.border)
      
      // Primary color
      root.style.setProperty('--primary', themeOption.colors.primary)
      root.style.setProperty('--primary-foreground', themeOption.colors.primaryForeground)
      
      // Optional colors if defined
      if (themeOption.colors.accent) {
        root.style.setProperty('--accent', themeOption.colors.accent)
      }
      if (themeOption.colors.muted) {
        root.style.setProperty('--muted', themeOption.colors.muted)
      }
    } catch (error) {
      console.error('Error applying theme colors:', error)
    }
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

