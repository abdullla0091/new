"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Lock } from "lucide-react";

interface ChatHeaderProps {
  characterName: string;
  characterImage: string | null;
  avatarGradient: string;
  status: string;
  isLocked?: boolean;
  onInfoClick: () => void;
  onLanguageToggle: () => void;
  currentLanguage: 'en' | 'ku';
  hasSavedChats?: boolean;
}

export default function ChatHeader({
  characterName,
  characterImage,
  avatarGradient,
  status,
  isLocked = false,
  onInfoClick,
  onLanguageToggle,
  currentLanguage,
  hasSavedChats = false
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 bg-indigo-950/90 backdrop-blur-md border-b border-purple-500/20 z-50 shadow-[0_4px_20px_rgba(88,28,135,0.15)]">
      <div className="flex items-center flex-1 min-w-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push('/explore')} 
          className="text-purple-300 hover:text-white hover:bg-purple-800/30 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        <div className="flex items-center ml-2 sm:ml-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="p-0.5 bg-gradient-to-br from-purple-500/50 to-indigo-600/50 rounded-full">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-1 ring-purple-500/20">
                {characterImage ? (
                  <AvatarImage src={characterImage} alt={characterName || 'Character'} className="object-cover" />
                ) : (
                  <AvatarFallback className={`bg-gradient-to-br ${avatarGradient}`}>
                    {characterName?.[0] || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            {isLocked && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5">
                <Lock className="h-2.5 w-2.5 text-indigo-950" />
              </div>
            )}
          </div>
          
          <div className="ml-2 sm:ml-3 truncate">
            <h1 className="font-bold text-white text-sm sm:text-base truncate">{characterName || 'Character'}</h1>
            <p className="text-xs text-purple-300 truncate">{status}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
        {hasSavedChats && (
          <div className="text-xs text-green-400 flex items-center mr-1">
            <Lock className="h-2.5 w-2.5 mr-1" />
            <span className="hidden sm:inline text-xs">Saved</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onInfoClick}
          className="text-purple-300 hover:text-white hover:bg-purple-800/30 h-8 w-8 sm:h-9 sm:w-9"
        >
          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onLanguageToggle}
          className="h-8 sm:h-9 px-2 sm:px-3 bg-indigo-800/40 border-purple-500/20 hover:bg-purple-600/30 text-white text-xs sm:text-sm"
        >
          {currentLanguage.toUpperCase()}
        </Button>
      </div>
    </header>
  );
} 