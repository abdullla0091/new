"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ChatInput({
  onSendMessage,
  isProcessing = false,
  placeholder = "Type a message...",
  className
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-end gap-2 p-2 sm:p-3 bg-gradient-to-t from-black/50 via-black/30 to-transparent backdrop-blur-lg",
        className
      )}
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isProcessing}
          rows={1}
          className="min-h-[44px] w-full resize-none bg-indigo-950/50 border-indigo-500/30 focus:border-indigo-500/50 rounded-2xl pr-[88px] sm:pr-24 py-3 px-4 text-base placeholder:text-gray-400"
        />
        <div className="absolute right-2 bottom-1 flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isProcessing}
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "h-8 w-8 hover:bg-indigo-600/20",
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
            className="h-8 w-8 hover:bg-indigo-600/20"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
} 