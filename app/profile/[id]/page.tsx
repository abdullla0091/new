"use client";

import { useParams, useRouter } from 'next/navigation';
import { getCharacterById } from "@/lib/characters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from 'react';
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage";
import { isCharacterFavorite, toggleFavoriteCharacter } from "@/lib/favorites";
import { useToast } from "@/components/ui/use-toast";

// Function to generate a background color based on the character name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-purple-600", "bg-indigo-600", "bg-violet-600", 
    "bg-fuchsia-600", "bg-blue-600", "bg-sky-600"
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function CharacterProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const characterId = params?.id as string;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get character data
  const character = getCharacterById(characterId);
  
  // Handle non-existent character
  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
        <h1 className="text-2xl font-bold mb-4">Character not found</h1>
        <p className="mb-6">We couldn't find the character you're looking for.</p>
        <Button 
          onClick={() => router.push('/explore')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Browse Characters
        </Button>
      </div>
    );
  }
  
  // Load profile image and favorite status
  useEffect(() => {
    // Try to get character image from various sources
    const savedImage = getCharacterImage(characterId);
    if (savedImage) {
      setProfileImage(savedImage);
    } else if (character.avatar) {
      setProfileImage(character.avatar);
    } else {
      setProfileImage(getDummyCharacterImage(characterId));
    }
    
    // Check if character is favorited
    setIsFavorite(isCharacterFavorite(characterId));
  }, [characterId, character.avatar]);
  
  // Handle favorite button click
  const handleFavoriteClick = () => {
    const newStatus = toggleFavoriteCharacter(characterId);
    setIsFavorite(newStatus);
    
    toast({
      title: newStatus ? "Added to favorites" : "Removed from favorites",
      description: `${character.name} has been ${newStatus ? "added to" : "removed from"} your favorites`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white">
      {/* Header */}
      <header className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Character Profile</h1>
      </header>
      
      <div className="max-w-2xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] mb-8">
          <div className="mb-4 p-1 bg-gradient-to-br from-purple-500/50 to-indigo-600/50 rounded-full">
            <Avatar className="h-32 w-32 ring-2 ring-purple-500/20">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={character.name} className="object-cover" />
              ) : (
                <AvatarFallback className={getAvatarColor(character.name)}>
                  {character.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{character.name}</h2>
          
          {character.rating && (
            <div className="flex items-center mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-yellow-100">{character.rating}</span>
            </div>
          )}
          
          <p className="text-gray-200 text-center mb-4">{character.description}</p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {character.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-purple-900/50 text-purple-200 rounded-full px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => router.push(`/chat/${character.id}`)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Now
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFavoriteClick}
              className={`border-purple-400 ${isFavorite ? 'bg-purple-400/20' : ''}`}
            >
              <Star className={`h-4 w-4 mr-2 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
        
        {/* Character Personality */}
        <div className="bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold mb-4">About {character.name}</h3>
          
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line">
              {character.personalityPrompt.includes('YOUR CORE TRAITS:') 
                ? character.personalityPrompt.split('YOUR CORE TRAITS:')[0].trim()
                : character.personalityPrompt}
            </p>
            
            {character.personalityPrompt.includes('YOUR CORE TRAITS:') && character.personalityPrompt.includes('HOW YOU THINK:') && (
              <>
                <h4 className="text-lg font-medium mt-4 mb-2">Core Traits</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {character.personalityPrompt
                    .split('YOUR CORE TRAITS:')[1]
                    .split('HOW YOU THINK:')[0]
                    .split('-')
                    .filter(item => item.trim())
                    .map((trait, index) => (
                      <li key={index}>{trait.trim()}</li>
                    ))}
                </ul>
              </>
            )}
            
            {character.personalityPrompt.includes('HOW YOU THINK:') && character.personalityPrompt.includes('HOW YOU SPEAK:') && (
              <>
                <h4 className="text-lg font-medium mt-4 mb-2">Thinking Style</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {character.personalityPrompt
                    .split('HOW YOU THINK:')[1]
                    .split('HOW YOU SPEAK:')[0]
                    .split('-')
                    .filter(item => item.trim())
                    .map((thought, index) => (
                      <li key={index}>{thought.trim()}</li>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 