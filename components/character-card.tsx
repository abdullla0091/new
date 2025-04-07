"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { isCharacterFavorite, toggleFavoriteCharacter } from "@/lib/favorites"
import { useToast } from "@/components/ui/use-toast"
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage"
import { Button } from "@/components/ui/button"

// Use the Character type from lib/characters, assuming it will be moved or aliased correctly
// For now, redefine it here to match the expected data structure from app/page.tsx
interface Character {
  id: string | number; // Allow string ID
  name: string;
  description: string;
  avatar?: string; // Make avatar optional as in lib/characters
  category?: string; // Make category optional
  rating?: number | string; // Allow string or number rating
  tags?: string[]; // Allow tags
}

// Generate a background color based on the character name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-purple-600", "bg-indigo-600", "bg-violet-600", 
    "bg-fuchsia-600", "bg-blue-600", "bg-sky-600"
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function CharacterCard({ character }: { character: Character }) {
  const router = useRouter()
  const { toast } = useToast()
  const avatarColor = getAvatarColor(character.name);
  const characterId = character.id.toString();
  
  // State for favorite status and profile image
  const [isFavorite, setIsFavorite] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Load favorite status and profile image on component mount
  useEffect(() => {
    setIsFavorite(isCharacterFavorite(characterId));
    
    // Try to get saved image from localStorage first
    const savedImage = getCharacterImage(characterId);
    if (savedImage) {
      setProfileImage(savedImage);
    } else if (character.avatar) {
      // Use avatar from character data if available
      setProfileImage(character.avatar);
    } else {
      // Use dummy image as fallback
      setProfileImage(getDummyCharacterImage(characterId));
    }
  }, [characterId, character.avatar]);
  
  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening chat when clicking favorite
    const newStatus = toggleFavoriteCharacter(characterId);
    setIsFavorite(newStatus);
    
    toast({
      title: newStatus ? "Added to favorites" : "Removed from favorites",
      description: `${character.name} has been ${newStatus ? "added to" : "removed from"} your favorites`,
      duration: 2000,
    });
  };

  // Handle profile click
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening chat when clicking profile
    router.push(`/profile/${characterId}`);
  };

  return (
    <div
      className="bg-indigo-800/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1 relative"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/chat/${character.id}`);
      }}
    >
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex space-x-1 z-10">
        <button 
          className="p-1 rounded-full hover:bg-purple-600/20 transition-colors"
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-400"}`} />
        </button>
        <button 
          className="p-1 rounded-full hover:bg-purple-600/20 transition-colors"
          onClick={handleProfileClick}
          title="View profile"
        >
          <Info className="h-5 w-5 text-gray-300 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="mb-3 p-1 bg-gradient-to-br from-purple-500/50 to-indigo-600/50 rounded-full">
          <Avatar className="h-16 w-16 ring-2 ring-purple-500/20">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={character.name} />
            ) : (
              <AvatarFallback className={`${avatarColor} text-white`}>
                {character.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <h3 className="font-medium text-center text-white">{character.name}</h3>
        {character.rating && ( // Conditionally render rating
          <div className="flex items-center mt-1 mb-2">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            {/* Display rating, converting if necessary */}
            <span className="text-xs ml-1 text-yellow-100">{typeof character.rating === 'string' ? parseFloat(character.rating).toFixed(1) : character.rating}</span>
          </div>
        )}
        <p className="text-xs text-gray-200 text-center line-clamp-2 overflow-hidden text-ellipsis max-w-full">
          {character.description}
        </p>
        
        {/* Action Buttons at Bottom */}
        <div className="flex items-center justify-between w-full mt-4 pt-2 border-t border-purple-500/10">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs text-purple-300 hover:text-white hover:bg-purple-600/30 w-1/2"
            onClick={handleProfileClick}
          >
            <Info className="h-3 w-3 mr-1" />
            Profile
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs text-purple-300 hover:text-white hover:bg-purple-600/30 w-1/2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/chat/${characterId}`);
            }}
          >
            <User className="h-3 w-3 mr-1" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
