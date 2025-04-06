"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { themes, ThemeOption, setCurrentTheme } from "@/lib/themes"
import { Check, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleThemeChange = (themeId: string) => {
    // Handle 'system' theme specially
    if (themeId === 'system') {
      setTheme('system')
    } else {
      // Set theme in next-themes
      const selectedTheme = themes.find(t => t.id === themeId)
      if (selectedTheme) {
        setTheme(selectedTheme.isDark ? 'dark' : 'light')
        
        // Also store the specific theme preference
        setCurrentTheme(themeId)
      }
    }
    
    toast({
      title: "Theme Changed",
      description: `Theme set to ${themeId === 'system' ? 'System Default' : themeId}`,
      duration: 2000,
    })
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {/* System theme option */}
      <div
        className={cn(
          "p-2 rounded-lg border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          theme === 'system' && "ring-2 ring-primary"
        )}
        onClick={() => handleThemeChange('system')}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium">System</span>
          </div>
          {theme === 'system' && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex rounded-md overflow-hidden h-8">
          <div className="w-1/2 bg-white border-r"></div>
          <div className="w-1/2 bg-gray-900"></div>
        </div>
      </div>

      {/* Predefined themes */}
      {themes.map((themeOption: ThemeOption) => (
        <div
          key={themeOption.id}
          className={cn(
            "p-2 rounded-lg border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            theme === (themeOption.isDark ? 'dark' : 'light') && "ring-2 ring-primary"
          )}
          onClick={() => handleThemeChange(themeOption.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full" 
                style={{ backgroundColor: themeOption.colors.primary }}
              ></div>
              <span className="text-sm font-medium">{themeOption.name}</span>
            </div>
            {theme === (themeOption.isDark ? 'dark' : 'light') && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </div>
          <div 
            className="rounded-md overflow-hidden h-8"
            style={{ backgroundColor: themeOption.colors.background }}
          >
            <div 
              className="h-2 w-full mt-2 mx-auto rounded"
              style={{ 
                backgroundColor: themeOption.colors.primary,
                width: '80%'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
} 