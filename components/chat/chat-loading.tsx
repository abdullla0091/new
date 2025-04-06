"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatLoadingProps {
  characterName: string;
  characterImage: string | null;
  avatarGradient: string;
}

// Function to generate a background gradient based on the character name
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
  
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function ChatLoading({
  characterName,
  characterImage,
  avatarGradient
}: ChatLoadingProps) {
  return (
    <div className="flex justify-start">
      <div className="flex-shrink-0 mr-3 mt-1">
        <div className="p-0.5 bg-gradient-to-br from-purple-500/50 to-indigo-600/50 rounded-full">
          <Avatar className="h-8 w-8 ring-1 ring-purple-500/20">
            {characterImage ? (
              <AvatarImage src={characterImage} alt={characterName} className="object-cover" />
            ) : (
              <AvatarFallback className={`bg-gradient-to-br ${avatarGradient || getAvatarGradient(characterName)}`}>
                {characterName?.[0] || '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
      <div className="px-5 py-3.5 bg-indigo-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl rounded-tl-none">
        <div className="flex space-x-2">
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-bounce"></div>
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="h-2.5 w-2.5 bg-purple-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
} 