"use client"

import { useState, useEffect } from "react"
import { Check, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function ChatBackground() {
  const [background, setBackground] = useState<string | null>(null)
  const { toast } = useToast()

  // Load saved background preference
  useEffect(() => {
    const savedBackground = localStorage.getItem('chat-background');
    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  const backgrounds = [
    { id: "default", name: "Default", gradient: "bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950" },
    { id: "midnight", name: "Midnight", gradient: "bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950" },
    { id: "sunset", name: "Sunset", gradient: "bg-gradient-to-b from-indigo-950 via-purple-800 to-rose-900" },
    { id: "aurora", name: "Aurora", gradient: "bg-gradient-to-b from-teal-950 via-cyan-900 to-teal-950" },
    { id: "cosmic", name: "Cosmic", gradient: "bg-gradient-to-b from-violet-950 via-fuchsia-900 to-violet-950" },
    { id: "royal", name: "Royal", gradient: "bg-gradient-to-b from-blue-950 via-indigo-900 to-blue-950" },
    { id: "dark", name: "Dark", gradient: "bg-black" },
    { id: "pattern", name: "Pattern", pattern: 'bg-[url("/images/chat-pattern.png")] bg-repeat bg-opacity-10 bg-indigo-950' },
  ]

  const handleBackgroundChange = (id: string) => {
    setBackground(id)
    localStorage.setItem('chat-background', id);
    toast({
      title: "Theme updated",
      description: `Chat background changed successfully`,
      duration: 1500,
    })
  }

  const getBackgroundStyle = () => {
    if (!background) return backgrounds[0].gradient
    const bg = backgrounds.find((b) => b.id === background)
    return bg?.pattern || bg?.gradient || backgrounds[0].gradient
  }

  return (
    <>
      <div className={`fixed inset-0 ${getBackgroundStyle()}`}></div>
      
      <div className="fixed top-16 right-3 z-10 md:top-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-indigo-900 border border-purple-500/20 text-purple-300 hover:text-white hover:bg-purple-800/50"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-indigo-900 border border-purple-500/30 p-3">
            <div>
              <h3 className="text-sm font-medium mb-3 text-purple-200">Chat Theme</h3>
              <div className="grid grid-cols-4 gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    className={`w-8 h-8 rounded-full ${bg.pattern || bg.gradient} flex items-center justify-center border-2 ${background === bg.id ? 'border-purple-400' : 'border-transparent'} hover:border-purple-500/50 transition-all`}
                    onClick={() => handleBackgroundChange(bg.id)}
                    title={bg.name}
                  >
                    {background === bg.id && <Check className="h-4 w-4 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

