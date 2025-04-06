"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Character } from "@/lib/characters"
import { getAllCharacters } from "@/lib/custom-characters"
import CharacterCard from "@/components/character-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, Clock, TrendingUp, Users, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "../i18n/LanguageContext"

export default function HomePage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const isKurdish = language === "ku"
  const [characters, setCharacters] = useState<Character[]>([])
  const [recentChats, setRecentChats] = useState<any[]>([])
  
  useEffect(() => {
    // Load all characters
    const allCharacters = getAllCharacters()
    
    // Process characters with additional properties
    const processedChars = allCharacters.map((char: Character, index: number) => {
      const isCustom = (char as any).isCustom
      
      return {
        ...char,
        avatar: null,
        rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
        category: char.category || char.tags[0] || "General",
        verified: !isCustom && index % 3 === 0,
        totalChats: Math.floor(Math.random() * 25000) + 5000,
        createdDate: isCustom ? new Date() : new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
      }
    })
    
    setCharacters(processedChars)
    
    // Generate mock recent chats
    const mockRecentChats = processedChars.slice(0, 5).map(char => ({
      id: `chat-${char.id}`,
      character: char,
      lastMessage: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 72) * 60 * 60 * 1000)
    }))
    
    setRecentChats(mockRecentChats)
  }, [])
  
  // Get popular characters (based on totalChats)
  const popularCharacters = [...characters]
    .sort((a, b) => (b.totalChats || 0) - (a.totalChats || 0))
    .slice(0, 6)
  
  // Get trending characters (just a different subset for demo)
  const trendingCharacters = [...characters]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)
  
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }
  
  const handleCharacterClick = (id: string) => {
    router.push(`/chat/${id}`)
  }

  return (
    <div className={`container mx-auto flex flex-col flex-grow p-4 md:p-6 space-y-8 overflow-y-auto pb-20 z-10 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
      {/* Welcome Header */}
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          {t("welcomeBack")}
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          {t("discoverCharacters")}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        {/* Popular Characters Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">{t("popularCharacters")}</h2>
            </div>
            <Link href="/explore">
              <Button variant="link" className="text-purple-300 hover:text-purple-200 p-0 flex items-center gap-1">
                {t("viewAll")} <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCharacters.map(char => (
              <div 
                key={char.id} 
                onClick={() => handleCharacterClick(char.id)}
                className="cursor-pointer transform hover:scale-[1.03] transition-transform"
              >
                <CharacterCard character={char} />
                
                {/* Custom character badge */}
                {(char as any).isCustom && (
                  <div className="mt-1 flex justify-center">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs bg-indigo-800/40 border-purple-500/20 text-purple-300">
                      <Sparkles className="h-3 w-3" />
                      {t("create")}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        
        {/* Trending Characters Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              <h2 className="text-xl font-semibold text-white">{t("trendingNow")}</h2>
            </div>
            <Link href="/explore?filter=trending">
              <Button variant="link" className="text-purple-300 hover:text-purple-200 p-0 flex items-center gap-1">
                {t("viewAll")} <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingCharacters.map(char => (
              <div 
                key={char.id} 
                onClick={() => handleCharacterClick(char.id)}
                className="cursor-pointer transform hover:scale-[1.03] transition-transform"
              >
                <CharacterCard character={char} />
              </div>
            ))}
          </div>
        </section>
        
        {/* Recent Conversations Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">{t("recentConversations")}</h2>
            </div>
            <Button variant="link" className="text-purple-300 hover:text-purple-200 p-0 flex items-center gap-1">
              {t("viewAll")} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-indigo-900/20 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden">
            {recentChats.length > 0 ? (
              <div className="divide-y divide-purple-500/10">
                {recentChats.map(chat => (
                  <div
                    key={chat.id}
                    className="p-4 hover:bg-purple-600/10 transition-colors cursor-pointer flex items-center"
                    onClick={() => router.push(`/chat/${chat.character.id}`)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/50 to-indigo-600/50 flex-shrink-0 flex items-center justify-center">
                      {chat.character.name.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white truncate">{chat.character.name}</h4>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatRelativeTime(chat.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{chat.lastMessage}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
                <h3 className="text-lg font-semibold mb-2 text-purple-200">{t("noRecentConversations")}</h3>
                <p className="text-gray-300 max-w-md mx-auto mb-4">
                  {t("startChattingToSee")}
                </p>
                <Button 
                  onClick={() => router.push('/explore')}
                  className="bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)] mx-auto"
                >
                  {t("explore")}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
} 