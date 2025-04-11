"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, User, Pen, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { getCustomCharacters } from "@/lib/custom-characters";
import { Character } from "@/lib/characters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCharacterImage, getDummyCharacterImage } from "@/lib/image-storage";
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

export default function CustomCharactersPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { language, isKurdish } = useLanguage();
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const { toast } = useToast();
  
  // Load custom characters
  useEffect(() => {
    const loadCustomCharacters = () => {
      const characters = getCustomCharacters();
      setCustomCharacters(characters);
    };
    
    loadCustomCharacters();
    
    // Listen for custom character changes
    window.addEventListener('custom-characters-changed', loadCustomCharacters);
    
    setMounted(true);
    
    return () => {
      window.removeEventListener('custom-characters-changed', loadCustomCharacters);
    };
  }, []);

  const handleCreateNew = () => {
    // Navigate to character creation page (this would be implemented in a real app)
    toast({
      title: isKurdish ? "داهاتوو" : "Coming Soon",
      description: isKurdish 
        ? "دروستکردنی کەسایەتی نوێ بەم زووانە بەردەست دەبێت"
        : "Creating new characters will be available soon",
      duration: 3000
    });
  };

  const handleEditCharacter = (characterId: string | number) => {
    // Navigate to character edit page (this would be implemented in a real app)
    toast({
      title: isKurdish ? "داهاتوو" : "Coming Soon",
      description: isKurdish 
        ? "دەستکاریکردنی کەسایەتی بەم زووانە بەردەست دەبێت"
        : "Editing characters will be available soon",
      duration: 3000
    });
  };

  const handleChatWithCharacter = (characterId: string | number) => {
    router.push(`/chat/${characterId}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className={cn("rounded-full text-white hover:bg-white/10", isKurdish ? "ml-2" : "mr-2")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {isKurdish ? "کەسایەتییە ڕاهێنراوەکان" : "Custom Characters"}
          </h1>
        </div>
        
        <Button 
          onClick={handleCreateNew}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isKurdish ? "دروستکردن" : "Create"}
        </Button>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 flex-1">
        {customCharacters.length === 0 ? (
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-indigo-800/50 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-purple-300" />
            </div>
            <p className={cn("text-lg text-purple-300", isKurdish && "text-right")}>
              {isKurdish 
                ? "هیچ کەسایەتییەکی ڕاهێنراو نییە. دەتوانیت کەسایەتی نوێ دروست بکەیت."
                : "No custom characters yet. Create your first character!"}
            </p>
            <Button 
              onClick={handleCreateNew}
              className="mt-6 bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isKurdish ? "دروستکردنی کەسایەتی" : "Create Character"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customCharacters.map((character) => {
              const characterId = character.id.toString();
              const profileImage = character.avatar || getDummyCharacterImage(characterId);
              
              return (
                <div 
                  key={characterId}
                  className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt={character.name} />
                      ) : (
                        <AvatarFallback className={getAvatarColor(character.name)}>
                          {character.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{character.name}</h2>
                      <p className="text-sm text-purple-300 truncate">
                        {character.description?.substring(0, 60)}
                        {character.description?.length > 60 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 mb-3">
                    {character.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-purple-800/40 text-purple-200 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex mt-4 justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditCharacter(characterId)}
                      className="bg-transparent border-purple-500/30 hover:bg-purple-500/20 text-purple-200"
                    >
                      <Pen className="h-3.5 w-3.5 mr-1" />
                      {isKurdish ? "دەستکاری" : "Edit"}
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
  );
} 