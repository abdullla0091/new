"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, StopCircle, X } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, replyToId?: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
  replyTo?: {
    id: string;
    content: string;
    isUser: boolean;
  } | null;
  onCancelReply?: () => void;
}

export default function ChatInput({
  onSendMessage,
  isProcessing = false,
  placeholder = "Type a message...",
  className,
  replyTo,
  onCancelReply
}: ChatInputProps) {
  const { language } = useLanguage();
  const isKurdish = language === 'ku';
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Determine text direction based on content
  const getTextDirection = (text: string): 'rtl' | 'ltr' => {
    // Simple detection for RTL text using specific Unicode ranges for Arabic script
    const hasRTLChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
    return hasRTLChars || isKurdish ? 'rtl' : 'ltr';
  };

  // Focus the textarea when replying to a message
  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim(), replyTo?.id);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      // Clear reply state
      if (onCancelReply && replyTo) {
        onCancelReply();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && replyTo && onCancelReply) {
      onCancelReply();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  // Set initial text direction based on language
  const currentDirection = getTextDirection(message);

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex flex-col items-end gap-2 p-2 sm:p-3 bg-indigo-950/90 border-t border-purple-500/20 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {/* Reply indicator */}
      {replyTo && (
        <div className={`w-full flex ${isKurdish ? 'flex-row-reverse' : ''} items-center justify-between px-3 py-1.5 rounded-lg mb-1 
          ${replyTo.isUser 
            ? 'bg-indigo-800/40 text-indigo-100'
            : 'bg-indigo-800/40 text-indigo-100'}`
        }>
          <div className={`flex ${isKurdish ? 'flex-row-reverse' : ''} items-center gap-2 text-sm`}>
            <span className="text-xs opacity-75" dir={isKurdish ? 'rtl' : 'ltr'}>
              {isKurdish 
                ? (replyTo.isUser ? 'وەڵامدانەوەی نامەکەی خۆت' : 'وەڵامدانەوەی نامە') 
                : (replyTo.isUser ? 'Replying to yourself' : 'Replying to message')}
            </span>
            <span className="truncate max-w-[200px] sm:max-w-[400px] opacity-90"
                  dir={getTextDirection(replyTo.content)}>
              {replyTo.content.length > 50 ? replyTo.content.substring(0, 50) + '...' : replyTo.content}
            </span>
          </div>
          {onCancelReply && (
            <Button 
              type="button"
              size="icon"
              variant="ghost"
              onClick={onCancelReply}
              className="h-6 w-6 hover:bg-indigo-700/50 text-indigo-300"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <div className="relative flex-1 w-full">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isProcessing}
          rows={1}
          dir={currentDirection}
          className={cn(
            "min-h-[44px] w-full resize-none bg-indigo-900/70 border-indigo-500/50",
            "focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 rounded-2xl",
            "pr-[88px] sm:pr-24 py-3 px-4 text-base placeholder:text-gray-400 text-white",
            isKurdish && "kurdish"
          )}
          style={{
            textAlign: currentDirection === 'rtl' ? 'right' : 'left'
          }}
        />
        <div className={`absolute ${isKurdish ? 'left-2' : 'right-2'} bottom-1 flex items-center gap-1`}>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isProcessing}
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "h-8 w-8 hover:bg-indigo-600/20 text-white",
              isRecording && "text-red-500 animate-pulse"
            )}
          >
            {isRecording ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!message.trim() || isProcessing}
            className="h-8 w-8 hover:bg-indigo-600/20 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
} 