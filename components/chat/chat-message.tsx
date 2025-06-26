"use client"

import React, { useContext } from 'react';
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMessageProps {
  id: string;
  role: 'user' | 'model';
  content: string[];
  timestamp?: number;
  characterName?: string;
  characterImage?: string | null;
  avatarGradient?: string;
  onDelete?: (id: string) => void;
  currentTheme?: string; // Add theme prop
}

export default function ChatMessage({
  id,
  role,
  content,
  timestamp,
  characterName,
  characterImage,
  avatarGradient,
  onDelete,
  currentTheme = 'default'
}: ChatMessageProps) {
  const { language } = useLanguage();
  const isUser = role === 'user';
  const isKurdish = language === 'ku';
  const formattedTime = timestamp ? format(new Date(timestamp), 'h:mm a') : '';
  
  // Theme-based styling
  const getThemeStyles = (theme: string) => {
    const themes = {
      default: {
        userBg: 'bg-gradient-to-br from-indigo-600 to-purple-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-indigo-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-indigo-200/30',
        timestamp: 'text-gray-500'
      },
      forest: {
        userBg: 'bg-gradient-to-br from-emerald-600 to-green-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-emerald-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-emerald-200/30',
        timestamp: 'text-gray-500'
      },
      ocean: {
        userBg: 'bg-gradient-to-br from-blue-600 to-cyan-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-blue-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-blue-200/30',
        timestamp: 'text-gray-500'
      },
      sunset: {
        userBg: 'bg-gradient-to-br from-orange-600 to-red-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-orange-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-orange-200/30',
        timestamp: 'text-gray-500'
      },
      midnight: {
        userBg: 'bg-gradient-to-br from-gray-700 to-gray-900',
        aiBg: 'bg-gray-100/95 backdrop-blur-md border border-gray-200/20',
        userText: 'text-white',
        aiText: 'text-gray-900',
        avatarRing: 'ring-gray-300/30',
        timestamp: 'text-gray-600'
      },
      rose: {
        userBg: 'bg-gradient-to-br from-rose-600 to-pink-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-rose-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-rose-200/30',
        timestamp: 'text-gray-500'
      },
      cosmic: {
        userBg: 'bg-gradient-to-br from-violet-600 to-purple-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-violet-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-violet-200/30',
        timestamp: 'text-gray-500'
      },
      earth: {
        userBg: 'bg-gradient-to-br from-amber-600 to-yellow-700',
        aiBg: 'bg-white/95 backdrop-blur-md border border-amber-100/20',
        userText: 'text-white',
        aiText: 'text-gray-800',
        avatarRing: 'ring-amber-200/30',
        timestamp: 'text-gray-500'
      }
    };
    return themes[theme as keyof typeof themes] || themes.default;
  };

  const themeStyles = getThemeStyles(currentTheme);
  
  // Determine message text direction
  const getTextDirection = (text: string): 'rtl' | 'ltr' => {
    // Simple detection for RTL text using specific Unicode ranges for Arabic script
    const hasRTLChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
    return hasRTLChars ? 'rtl' : 'ltr';
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-6`}>
      <div className={`flex items-start max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className="relative">
            <Avatar className={`h-10 w-10 ring-2 ${themeStyles.avatarRing} shadow-md`}>
              {isUser ? (
                <AvatarFallback className={`${themeStyles.userBg} ${themeStyles.userText} font-semibold text-sm`}>
                  {isKurdish ? 'ت' : 'U'}
                </AvatarFallback>
              ) : characterImage ? (
                <AvatarImage src={characterImage} alt={characterName || 'Assistant'} className="object-cover" />
              ) : (
                <AvatarFallback className={`bg-gradient-to-br ${avatarGradient} text-white font-semibold text-sm`}>
                  {characterName?.[0] || 'A'}
                </AvatarFallback>
              )}
            </Avatar>
            {/* Online indicator for AI */}
            {!isUser && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1`}>
          {/* Message Header */}
          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className={`text-sm font-medium ${themeStyles.timestamp}`}>
              {isUser ? (isKurdish ? 'تۆ' : 'You') : characterName || 'Assistant'}
            </span>
            <span className={`text-xs ${themeStyles.timestamp} opacity-70`}>
              {formattedTime}
            </span>
          </div>

          {/* Message Bubble */}
          {content.map((text, index) => {
            const textDirection = getTextDirection(text);
            
            return (
              <div
                key={index}
                className={`group relative px-4 py-3 rounded-2xl shadow-sm mb-1 last:mb-0 ${
                  isUser 
                    ? `${themeStyles.userBg} ${themeStyles.userText} ${isUser ? 'rounded-br-md' : ''}` 
                    : `${themeStyles.aiBg} ${themeStyles.aiText} ${!isUser ? 'rounded-bl-md' : ''}`
                } ${isKurdish ? 'kurdish' : ''} transition-all duration-200 hover:shadow-md`}
                dir={textDirection}
                style={{
                  textAlign: textDirection === 'rtl' ? 'right' : 'left',
                  unicodeBidi: 'embed',
                  fontSize: isKurdish ? '0.95em' : 'inherit',
                  lineHeight: '1.5',
                  letterSpacing: '0.01em'
                }}
              >
                {text}
                
                {/* Message Actions */}
                <div className={`absolute top-2 ${isUser ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                  {/* Delete dropdown */}
                  {onDelete && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${isUser ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align={isUser ? "start" : "end"}
                        className="bg-white border border-gray-200 shadow-md"
                      >
                        <DropdownMenuItem
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
                          onClick={() => onDelete(id)}
                        >
                          {isKurdish ? 'سڕینەوە' : 'Delete message'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}