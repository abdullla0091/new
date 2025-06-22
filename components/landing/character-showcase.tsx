"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { characters } from "@/lib/characters"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const showcaseCharacters = characters.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0)
  const { language, t } = useLanguage();

  useEffect(() => {
    // Auto-rotate the featured character every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseCharacters.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [showcaseCharacters.length])

  const activeCharacter = showcaseCharacters[activeIndex]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Featured character card */}
      <div className="relative bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] mb-12 overflow-hidden">
        {/* Background gradient animation */}
        <div
          className={`absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-r ${getAvatarGradient(activeCharacter.name)}`}
          style={{
            transform: "rotate(-5deg) scale(1.2)",
            transformOrigin: "top left",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Avatar */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`text-6xl w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-r ${getAvatarGradient(activeCharacter.name)} shadow-lg mb-4 overflow-hidden`}
            >
              {activeCharacter.avatar ? (
                <Avatar className="w-full h-full">
                  <AvatarImage src={activeCharacter.avatar} alt={activeCharacter.name} className="object-cover" />
                  <AvatarFallback className="text-2xl">{activeCharacter.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                activeCharacter.name.charAt(0)
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{activeCharacter.name}</h3>
            <p className="text-purple-300 font-medium">{activeCharacter.tags[0]}</p>
            {activeCharacter.rating && (
              <div className="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-yellow-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-yellow-300 ml-1">{activeCharacter.rating}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <p className="text-gray-200 text-lg mb-6">{activeCharacter.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {activeCharacter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-purple-900/50 text-purple-200 rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/chat/${activeCharacter.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                {t("startChatting")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Thumbnails for other characters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {showcaseCharacters.map((character, index) => (
          <button
            key={character.id}
            className={`p-4 rounded-xl text-center transition-all duration-300 ${
              index === activeIndex
                ? "bg-purple-800/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                : "bg-indigo-900/30 hover:bg-indigo-800/40"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <div
              className={`text-3xl w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r ${getAvatarGradient(character.name)} shadow-md mb-2 overflow-hidden`}
            >
              {character.avatar ? (
                <Avatar className="w-full h-full">
                  <AvatarImage src={character.avatar} alt={character.name} className="object-cover" />
                  <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                character.name.charAt(0)
              )}
            </div>
            <p className="font-medium text-white truncate">{character.name}</p>
          </button>
        ))}
      </div>
    </div>
  )
} 