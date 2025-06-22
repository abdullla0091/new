"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessage from '@/components/chat/chat-message';
import ChatInput from '@/components/chat/chat-input';
import { getAvatarGradient } from '@/lib/utils';
import { parseMessage } from '@/lib/message-parser';

interface Character {
  id: string;
  name: string;
  image: string | null;
  description: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string[];
  timestamp: number;
}

export default function ChatPage() {
  const params = useParams();
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !character || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: parseMessage(content),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  useEffect(() => {
    // Fetch character data
    const id = params?.id as string;
    if (id) {
      // Replace with your actual API call
      const mockCharacter: Character = {
        id,
        name: "AI Character",
        image: null,
        description: "An AI character"
      };
      setCharacter(mockCharacter);
    }
  }, [params?.id]);

  if (!character) {
    return null;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-b from-indigo-950 to-purple-950">
      <ChatHeader
        characterName={character.name}
        characterImage={character.image}
        avatarGradient={getAvatarGradient(character.name)}
        status={isProcessing ? 'typing...' : 'online'}
        onInfoClick={() => {}}
        onLanguageToggle={() => {}}
        currentLanguage="en"
      />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-600/20 hover:scrollbar-thumb-indigo-600/30">
        <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              characterName={character.name}
              characterImage={character.image}
              avatarGradient={getAvatarGradient(character.name)}
              onDelete={handleDeleteMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        placeholder={`Message ${character.name}...`}
        className="sticky bottom-0 max-w-4xl mx-auto w-full"
      />
    </div>
  );
}
