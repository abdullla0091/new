"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { getTranslation } from "@/app/i18n/translations"

export default function ThemeToggle({ variant = "switch" }: { variant?: "switch" | "button" }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()
  const { language } = useLanguage()
  const t = (key: any) => getTranslation(language, key)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    toast({
      title: t(`${newTheme}ModeActivated`) || `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: t(`switchedTo${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`) || `Switched to ${newTheme} theme`,
      duration: 2000,
    })
  }

  if (variant === "button") {
    return (
      <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
        {theme === "dark" ? <Sun className="h-5 w-5 text-purple-300" /> : <Moon className="h-5 w-5 text-purple-300" />}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-purple-300" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-purple-600"
      />
      <Moon className="h-4 w-4 text-purple-300" />
    </div>
  )
}

