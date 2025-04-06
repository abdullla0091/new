"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, ArrowLeft, ArrowRightCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { characters } from "@/lib/characters"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

// Generate a background color based on the character name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-blue-500 to-purple-500",
    "from-purple-500 to-indigo-600",
    "from-green-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-indigo-500 to-blue-600",
    "from-pink-500 to-rose-600",
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function CharacterShowcase() {
  // Select a subset of characters to showcase
  const showcaseCharacters = characters.slice(0, 6); // Show 6 characters instead of 4
  const [activeIndex, setActiveIndex] = useState(0)
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-rotate the featured character every 8 seconds
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseCharacters.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [showcaseCharacters.length])

  const activeCharacter = showcaseCharacters[activeIndex]

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + showcaseCharacters.length) % showcaseCharacters.length);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % showcaseCharacters.length);
  };

  // Safely get translation with fallback
  const getTranslation = (key: string, fallback: string = ""): string => {
    try {
      return t(key) || fallback;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return fallback;
    }
  };

  return (
    <div className="max-w-6xl mx-auto" ref={containerRef}>
      {/* Character Carousel */}
      <div className="relative">
        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 z-20 bg-purple-800/80 hover:bg-purple-700 text-white rounded-full p-2 shadow-xl backdrop-blur-sm transition-all duration-300"
          aria-label="Previous character"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 z-20 bg-purple-800/80 hover:bg-purple-700 text-white rounded-full p-2 shadow-xl backdrop-blur-sm transition-all duration-300"
          aria-label="Next character"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Main character card with 3D effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCharacter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-[0_5px_30px_rgba(88,28,135,0.5)] border border-purple-500/30"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-10 left-10 w-16 h-16 bg-purple-500/10 rounded-full blur-lg"></div>
            
            {/* Character details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 p-8 relative z-10">
              {/* Avatar and basic info */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start justify-center mb-6 md:mb-0 order-1 md:order-1">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getAvatarGradient(activeCharacter.name)} shadow-[0_0_20px_rgba(139,92,246,0.5)] mb-5 overflow-hidden ring-4 ring-purple-500/30 ring-offset-2 ring-offset-indigo-900/50`}>
                    {activeCharacter.avatar ? (
                      <Avatar className="w-full h-full">
                        <AvatarImage src={activeCharacter.avatar} alt={activeCharacter.name} className="w-full h-full object-cover" />
                        <AvatarFallback className="text-3xl font-bold">{activeCharacter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                        {activeCharacter.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-indigo-900 flex items-center justify-center">
                    <span className="sr-only">Online</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 text-center md:text-left">{activeCharacter.name}</h3>
                
                {/* Rating with stars */}
                {activeCharacter.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className={`w-4 h-4 ${
                            parseFloat(activeCharacter.rating as string) >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-yellow-300 font-medium ml-2">{activeCharacter.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                  {activeCharacter.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-purple-800/60 text-purple-200 rounded-full px-3 py-1 border border-purple-700/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description and chat button */}
              <div className="md:col-span-8 flex flex-col justify-center order-2 md:order-2 px-0 md:px-6">
                <div className="bg-indigo-950/40 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-700/20 shadow-inner">
                  <p className="text-gray-200 text-lg leading-relaxed">{activeCharacter.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link href={`/chat/${activeCharacter.id}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-8 py-6 text-lg shadow-[0_5px_15px_rgba(107,33,168,0.4)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(107,33,168,0.6)] hover:-translate-y-1 flex items-center justify-center">
                      {getTranslation("startChatting", "Start Chatting")}
                      <ArrowRightCircle className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <div className="text-center sm:text-left text-sm text-gray-300">
                    <span className="block">
                      {getTranslation("instantResponse", "Get instant responses")}
                    </span>
                    <span className="block text-purple-400">
                      {getTranslation("noSignupRequired", "No signup required")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Character selection indicators */}
      <div className="mt-8 flex justify-center space-x-2">
        {showcaseCharacters.map((character, index) => (
          <button
            key={character.id}
            className={`w-12 h-12 rounded-full relative border-2 transition-all duration-300 ${
              index === activeIndex
                ? "border-purple-400 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${character.name}`}
          >
            {character.avatar ? (
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={character.avatar} 
                  alt={character.name} 
                  className="object-cover"
                />
                <AvatarFallback className="text-sm">{character.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <div className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-r ${getAvatarGradient(character.name)}`}>
                <span className="text-white text-sm font-bold">{character.name.charAt(0)}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 