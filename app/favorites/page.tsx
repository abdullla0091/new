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
import { Heart, HeartOff, ArrowLeftCircle, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

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
    
    return () => {
      window.removeEventListener('favorites-changed', loadFavorites);
    };
  }, []);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6 z-10">
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
          FAVORITES
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
          Your Favorite Characters
        </h1>
        <p className="text-gray-200 max-w-2xl mx-auto">
          Access all your favorite AI characters in one place.
        </p>
      </div>

      <div className="mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30"
          onClick={() => router.push('/explore')}
        >
          <ArrowLeftCircle className="h-4 w-4" />
          Back to Explore
        </Button>
      </div>

      <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-indigo-800/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-3" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : favoriteCharacters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteCharacters.map(char => (
              <div 
                key={char.id} 
                className="cursor-pointer transform hover:scale-[1.02] transition-transform"
              >
                <CharacterCard character={char} />
                
                {/* Custom character badge */}
                {(char as any).isCustom && (
                  <div className="mt-1 flex justify-center">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs bg-indigo-800/40 border-purple-500/20 text-purple-300">
                      <Star className="h-3 w-3" />
                      Custom
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-purple-500/20 rounded-xl bg-indigo-900/30 backdrop-blur-md">
            <HeartOff className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-purple-200">No Favorites Yet</h3>
            <p className="text-gray-300 max-w-md mx-auto mb-6">
              You haven't added any characters to your favorites yet. Browse characters and click the star icon to add them to your favorites.
            </p>
            <Button 
              onClick={() => router.push('/explore')}
              className="bg-purple-600 hover:bg-purple-700 shadow-[0_0_15px_rgba(168,85,247,0.4)] mx-auto flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Find Characters to Favorite
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
