"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Character {
  id: number
  name: string
  role: string
  description: string
  avatarColor: string
  initial: string
}

const characters: Character[] = [
  {
    id: 1,
    name: "Professor Ada",
    role: "Academic Mentor",
    description:
      "A knowledgeable and patient academic who can explain complex topics in simple terms. Great for students and lifelong learners.",
    avatarColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    initial: "A",
  },
  {
    id: 2,
    name: "Dev",
    role: "Coding Assistant",
    description:
      "A tech-savvy programmer with a sense of humor. Helps with coding problems and explains technical concepts clearly.",
    avatarColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
    initial: "D",
  },
  {
    id: 3,
    name: "Sage",
    role: "Wisdom Guide",
    description:
      "A thoughtful philosopher who helps you explore ideas, reflect on challenges, and gain new perspectives on life.",
    avatarColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    initial: "S",
  },
  {
    id: 4,
    name: "Nova",
    role: "Creative Companion",
    description:
      "An imaginative artist who sparks creativity and helps with brainstorming, writing, and artistic endeavors.",
    avatarColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    initial: "N",
  },
  {
    id: 5,
    name: "Max",
    role: "Fitness Coach",
    description:
      "An energetic fitness expert who provides workout tips, nutrition advice, and motivational support for your health journey.",
    avatarColor: "bg-gradient-to-br from-orange-500 to-amber-600",
    initial: "M",
  },
]

export default function CharacterShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextCharacter = () => {
    setActiveIndex((prev) => (prev + 1) % characters.length)
  }

  const prevCharacter = () => {
    setActiveIndex((prev) => (prev - 1 + characters.length) % characters.length)
  }

  // Calculate which characters to show based on screen size
  const getVisibleCharacters = () => {
    // On mobile, just show the active character
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [characters[activeIndex]]
    }

    // On larger screens, show 3 characters
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % characters.length
      result.push(characters[index])
    }
    return result
  }

  return (
    <div className="relative">
      <div className="flex justify-center items-center gap-4 md:gap-8">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-12 w-12 rounded-full bg-indigo-800/70 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:bg-purple-600/70 transition-colors duration-300"
          onClick={prevCharacter}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous character</span>
        </Button>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {getVisibleCharacters().map((character, index) => (
            <div
              key={character.id}
              className={`
                bg-indigo-800/30 backdrop-blur-sm rounded-xl p-8 text-center
                transition-all duration-500 w-full md:w-80
                border border-purple-500/20
                hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
                ${index === 0 ? "md:scale-100 z-10" : "md:scale-90 opacity-70"}
              `}
            >
              <div
                className={`${character.avatarColor} w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform duration-300 hover:scale-110`}
              >
                {character.initial}
              </div>
              <h3 className="text-2xl font-semibold mb-1">{character.name}</h3>
              <p className="text-purple-300 mb-4">{character.role}</p>
              <p className="text-gray-300 mb-6">{character.description}</p>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                Chat with {character.name.split(" ")[0]}
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-12 w-12 rounded-full bg-indigo-800/70 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:bg-purple-600/70 transition-colors duration-300"
          onClick={nextCharacter}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next character</span>
        </Button>
      </div>

      {/* Mobile navigation */}
      <div className="flex justify-center mt-6 gap-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-indigo-800/70 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          onClick={prevCharacter}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex gap-2 items-center">
          {characters.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-purple-400 w-4" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-indigo-800/70 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          onClick={nextCharacter}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

