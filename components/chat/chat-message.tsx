"use client"

import React from 'react';
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
}

export default function ChatMessage({
  id,
  role,
  content,
  timestamp,
  characterName,
  characterImage,
  avatarGradient,
  onDelete
}: ChatMessageProps) {
  const isUser = role === 'user';
  const formattedTime = timestamp ? format(new Date(timestamp), 'h:mm a') : '';

  return (
    <div className={`flex items-start gap-2 sm:gap-3 group ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`p-0.5 rounded-full ${isUser ? 'bg-gradient-to-br from-purple-500/30 to-indigo-600/30' : 'bg-gradient-to-br from-purple-500/50 to-indigo-600/50'}`}>
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-1 ring-purple-500/20">
            {isUser ? (
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600">
                U
              </AvatarFallback>
            ) : characterImage ? (
              <AvatarImage src={characterImage} alt={characterName || 'Character'} className="object-cover" />
            ) : (
              <AvatarFallback className={`bg-gradient-to-br ${avatarGradient}`}>
                {characterName?.[0] || '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {content.map((text, index) => (
          <div
            key={index}
            className={`relative group px-3 py-2 rounded-2xl text-sm sm:text-base break-words
              ${isUser 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white ml-12' 
                : 'bg-indigo-900/40 backdrop-blur-md text-gray-100 mr-12'
              }`}
          >
            {text}
          </div>
        ))}
        
        {/* Timestamp and Actions */}
        <div className={`flex items-center gap-1 text-xs text-gray-400 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="opacity-60">{formattedTime}</span>
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? "end" : "start"}>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => onDelete(id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}