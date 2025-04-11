"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Star, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { characters } from "@/lib/characters"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

// Generate a background color based on the character name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-violet-500 to-indigo-600",
    "from-fuchsia-500 to-purple-700",
    "from-indigo-400 to-blue-600",
    "from-pink-500 to-rose-600",
    "from-purple-600 to-indigo-700",
    "from-blue-500 to-cyan-600",
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function CharacterShowcase() {
  // Select a subset of characters to showcase
  const showcaseCharacters = characters.slice(0, 6); // Show 6 characters
  const [activeIndex, setActiveIndex] = useState(0);
  const { language, t } = useLanguage();
  const isKurdish = language === "ku";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(-1);

  useEffect(() => {
    // Auto-rotate the featured character every 8 seconds if not hovering
    const interval = setInterval(() => {
      if (isHovering === -1) {
        setActiveIndex((current) => (current + 1) % showcaseCharacters.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [showcaseCharacters.length, isHovering]);

  const activeCharacter = showcaseCharacters[activeIndex];

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
    <motion.div 
      className="max-w-7xl mx-auto px-4"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative mb-8 md:mb-16">
        {/* Character carousel navigation controls */}
        <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-12 w-12 rounded-full bg-indigo-900/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-purple-600/90 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous character</span>
          </Button>
        </div>
        
        <div className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-12 w-12 rounded-full bg-indigo-900/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:bg-purple-600/90 transition-all duration-300 backdrop-blur-sm hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next character</span>
          </Button>
        </div>

        {/* Character display area - 3D card effect */}
        <motion.div 
          className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 to-purple-950/90 border border-purple-500/40 shadow-[0_10px_50px_rgba(109,40,217,0.35)] backdrop-blur-xl"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-fuchsia-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-violet-500/20 rounded-full blur-xl"></div>
          
          {/* Character content with animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCharacter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12">
                {/* Character Avatar Section */}
                <div className="md:col-span-5 flex flex-col items-center md:items-start justify-center">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative mb-6"
                  >
                    {/* Main avatar with 3D effect */}
                    <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0">
                      {/* Drop shadow gradient */}
                      <div className="absolute -bottom-4 w-full h-14 bg-purple-600/20 blur-xl rounded-full"></div>
                      
                      {/* 3D floating effect container */}
                      <motion.div
                        className="w-full h-full rounded-2xl overflow-hidden transform-gpu"
                        animate={{ 
                          y: [0, -8, 0],
                          rotateZ: [0, 1, 0],
                          rotateX: [0, 1, 0],
                          rotateY: [0, 1, 0],
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity, 
                          repeatType: "mirror",
                          ease: "easeInOut"
                        }}
                      >
                        {activeCharacter.avatar ? (
                          <div className="relative w-full h-full">
                            {/* Image container with glowing border */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 p-1">
                              <div className="h-full w-full rounded-xl overflow-hidden">
                                <img 
                                  src={activeCharacter.avatar} 
                                  alt={activeCharacter.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>
                            
                            {/* Glowing overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
                            
                            {/* Glossy reflection */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                          </div>
                        ) : (
                          <div className={`w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-r ${getAvatarGradient(activeCharacter.name)}`}>
                            <span className={`text-white text-4xl font-bold ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                              {activeCharacter.name.charAt(0)}
                            </span>
                            
                            {/* Glossy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Character name and details */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-center md:text-left space-y-4 mb-6"
                  >
                    <h3 className={`text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                      <span className={isKurdish ? 'en latin' : ''}>{activeCharacter.name}</span>
                    </h3>
                    
                    {/* Rating with animation */}
                    {activeCharacter.rating && (
                      <motion.div 
                        className="flex items-center justify-center md:justify-start space-x-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 font-medium ml-1 number">{activeCharacter.rating}</span>
                        <span className={`text-gray-400 text-sm ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>/ 5.0</span>
                      </motion.div>
                    )}
                    
                    {/* Tags with animation */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {activeCharacter.tags && activeCharacter.tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                          className={`px-3 py-1 text-sm rounded-full ${
                            index === 0 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-indigo-800/30 text-indigo-300'
                          } ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                {/* Character Description and Chat Button */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Description with animated gradient underline */}
                    <div className="relative mb-8">
                      <p className={`text-xl md:text-2xl leading-relaxed text-gray-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                        {activeCharacter.description}
                      </p>
                      <motion.div 
                        className="absolute -bottom-4 left-0 h-px w-16 bg-gradient-to-r from-purple-500 to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: "3rem" }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      />
                    </div>
                    
                    {/* Chat prompt preview */}
                    <div className="bg-indigo-900/30 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20">
                      <p className={`text-gray-400 italic text-sm md:text-base ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                        {isKurdish
                          ? "گفتوگۆ لەگەڵ کەسایەتی ئێمە دەستپێبکە، وەڵامی دەستبەجێ وەربگرە"
                          : "Start a conversation with this character to get instant responses to your messages. No signup required."}
                      </p>
                    </div>
                    
                    {/* Action button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                      className="flex justify-center md:justify-start"
                    >
                      <Link href={`/chat/${activeCharacter.id}`}>
                        <Button 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 h-auto rounded-xl shadow-[0_5px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_5px_30px_rgba(139,92,246,0.5)] transition-all duration-300 group"
                          size="lg"
                        >
                          <MessageSquare className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                          <span className={`${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                            {getTranslation("startChatting", "Start Chatting")}
                          </span>
                        </Button>
                      </Link>
                    </motion.div>
                    
                    {/* Instant responses badge */}
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 text-sm">
                      <div className={`flex items-center text-gray-400 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full mr-2"
                        />
                        {getTranslation("instantResponse", "Get instant responses to your messages")}
                      </div>
                      
                      <div className={`flex items-center text-gray-400 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-blue-500 rounded-full mr-2"
                        />
                        {getTranslation("noSignupRequired", "No signup required, start now")}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Pagination indicator dots for mobile */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        {showcaseCharacters.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="focus:outline-none"
            aria-label={`Go to character ${index + 1}`}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${
                index === activeIndex 
                  ? 'bg-purple-500' 
                  : 'bg-indigo-800 hover:bg-indigo-600'
              }`}
              animate={index === activeIndex ? { 
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  )
} 