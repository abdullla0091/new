"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllCharacters } from "@/lib/custom-characters"
import { Character } from "@/lib/characters"
import { getFavoriteCharacters } from "@/lib/favorites"
import CharacterCard from "@/components/character-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage"
import { Heart, HeartOff, ArrowLeftCircle, Star, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/app/i18n/LanguageContext"
import { cn } from "@/lib/utils"

// Generate a background color based on the character name
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-indigo-600 to-blue-600", 
    "from-blue-600 to-cyan-600",
    "from-cyan-600 to-teal-600",
    "from-teal-600 to-green-600",
    "from-pink-600 to-rose-600",
    "from-rose-600 to-red-600",
    "from-orange-600 to-amber-600"
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function FavoritesPage() {
  const router = useRouter()
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const { language, t, isKurdish } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Load favorite characters
  useEffect(() => {
    const loadFavorites = () => {
      setLoading(true);
      
      // Get all characters first
      const allCharacters = getAllCharacters();
      
      // Get IDs of favorite characters
      const favoriteIds = getFavoriteCharacters();
      
      // Filter characters that are favorites
      const favorites = allCharacters.filter(char => 
        favoriteIds.includes(char.id.toString())
      );
      
      // Add extra properties needed for display
      const processedFavorites = favorites.map((char, index) => {
        const isCustom = (char as any).isCustom;
        return {
          ...char,
          rating: char.rating || parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
          category: char.category || char.tags?.[0] || "General",
          verified: !isCustom && index % 3 === 0,
          totalChats: Math.floor(Math.random() * 25000) + 5000,
        };
      });
      
      setFavoriteCharacters(processedFavorites);
      setLoading(false);
    };
    
    loadFavorites();
    
    // Add event listener for favorites changes
    window.addEventListener('favorites-changed', loadFavorites);
    
    setMounted(true)
    
    return () => {
      window.removeEventListener('favorites-changed', loadFavorites);
    };
  }, []);

  // Handle chat with character
  const handleChatWithCharacter = (characterId: string | number) => {
    router.push(`/chat/${characterId}`);
  };

  // Handle view profile
  const handleViewProfile = (characterId: string | number) => {
    router.push(`/profile/${characterId}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className={cn("rounded-full text-white hover:bg-white/10", isKurdish ? "ml-2" : "mr-2")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "دڵخوازەکان" : "Favorites"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 flex-1">
        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4">
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favoriteCharacters.length === 0 ? (
          // No favorites message
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-indigo-800/50 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-400" />
            </div>
            <p className={cn("text-lg text-purple-300", isKurdish && "text-right")}>
              {isKurdish 
                ? "هیچ کەسایەتییەکت نەکردووە بە دڵخواز"
                : "You haven't added any characters to your favorites yet."}
            </p>
            <Button 
              onClick={() => router.push('/explore')}
              className="mt-6 bg-purple-600 hover:bg-purple-700"
            >
              {isKurdish ? "گەڕان بۆ کەسایەتی" : "Explore Characters"}
            </Button>
          </div>
        ) : (
          // Favorite characters list
          <div className="space-y-4">
            {favoriteCharacters.map((character) => {
              const characterId = character.id.toString();
              const profileImage = character.avatar || getDummyCharacterImage(characterId);
              
              return (
                <div 
                  key={characterId}
                  className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt={character.name} />
                      ) : (
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(character.name)}`}>
                          {character.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h2 className="text-lg font-semibold">{character.name}</h2>
                        {character.verified && (
                          <Badge variant="outline" className="ml-2 bg-purple-500/20 text-purple-200 border-purple-400 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-purple-300">
                        {character.rating && (
                          <div className="flex items-center mr-3">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span>{character.rating}</span>
                          </div>
                        )}
                        <span>{character.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex mt-4 justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(characterId)}
                      className="bg-transparent border-purple-500/30 hover:bg-purple-500/20 text-purple-200"
                    >
                      {isKurdish ? "پڕۆفایل" : "Profile"}
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={() => handleChatWithCharacter(characterId)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isKurdish ? "چات" : "Chat"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
