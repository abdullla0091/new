"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChatTheme {
  id: string;
  name: string;
  nameKu: string;
  background: string;
  preview: string;
}

const themes: ChatTheme[] = [
  {
    id: 'default',
    name: 'Purple Night',
    nameKu: 'شەوی مۆر',
    background: 'bg-gradient-to-b from-indigo-950 to-purple-950',
    preview: 'from-indigo-950 to-purple-950'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    nameKu: 'سەوزی دارستان',
    background: 'bg-gradient-to-b from-emerald-950 to-green-950',
    preview: 'from-emerald-950 to-green-950'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    nameKu: 'شینی زەریا',
    background: 'bg-gradient-to-b from-slate-950 to-blue-950',
    preview: 'from-slate-950 to-blue-950'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    nameKu: 'نارەنجی ئاوابوون',
    background: 'bg-gradient-to-b from-orange-950 to-red-950',
    preview: 'from-orange-950 to-red-950'
  },
  {
    id: 'midnight',
    name: 'Midnight Black',
    nameKu: 'ڕەشی نیوەشەو',
    background: 'bg-gradient-to-b from-gray-950 to-black',
    preview: 'from-gray-950 to-black'
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    nameKu: 'پەمەیی گوڵاو',
    background: 'bg-gradient-to-b from-rose-950 to-pink-950',
    preview: 'from-rose-950 to-pink-950'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Purple',
    nameKu: 'مۆری گەردوون',
    background: 'bg-gradient-to-b from-violet-950 to-purple-950',
    preview: 'from-violet-950 to-purple-950'
  },
  {
    id: 'earth',
    name: 'Earth Brown',
    nameKu: 'قاوەیی زەیی',
    background: 'bg-gradient-to-b from-amber-950 to-yellow-950',
    preview: 'from-amber-950 to-yellow-950'
  }
];

interface ChatThemeToggleProps {
  currentTheme: string;
  onThemeChange: (theme: ChatTheme) => void;
  language: string;
}

export default function ChatThemeToggle({ currentTheme, onThemeChange, language }: ChatThemeToggleProps) {
  const isKurdish = language === 'ku';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-indigo-800/40 hover:bg-indigo-700/60 transition-colors"
          title={isKurdish ? 'گۆڕینی ڕووکار' : 'Change Theme'}
        >
          <Palette className="h-4 w-4 text-purple-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-indigo-900/95 backdrop-blur-md border-purple-500/30"
      >
        <div className="p-2">
          <h3 className="text-sm font-semibold text-white mb-2 px-2">
            {isKurdish ? 'ڕووکارەکان' : 'Chat Themes'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                className="p-0 h-auto focus:bg-purple-500/20"
                onClick={() => onThemeChange(theme)}
              >
                <div className="flex flex-col items-center p-2 w-full cursor-pointer group">
                  {/* Theme Preview */}
                  <div className={`w-full h-8 rounded-md bg-gradient-to-br ${theme.preview} border border-purple-500/30 mb-1 relative overflow-hidden`}>
                    {currentTheme === theme.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white drop-shadow-md" />
                      </div>
                    )}
                  </div>
                  {/* Theme Name */}
                  <span className="text-xs text-center text-gray-200 group-hover:text-white transition-colors leading-tight">
                    {isKurdish ? theme.nameKu : theme.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { themes };
