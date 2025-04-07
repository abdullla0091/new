"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/app/i18n/LanguageContext';
import ChatHeader from '@/components/chat/chat-header';
import ChatMessage from '@/components/chat/chat-message';
import ChatInput from '@/components/chat/chat-input';
import { getAvatarGradient } from '@/lib/utils';
import { parseMessage } from '@/lib/message-parser';
import { characters } from '@/lib/characters';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Info, Heart } from "lucide-react";
import ChatSidebar from '@/components/chat/chat-sidebar';

// Gemini API key
const GEMINI_API_KEY = "AIzaSyBnKZr4eMrqd3-cMY3pYwIiqKg8ZCHT9oU";

interface Character {
  id: string;
  name: string;
  image: string | null;
  description: string;
  greeting?: string;
  rating?: number;
  totalChats?: number;
  category?: string;
  personalityPrompt?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string[];
  timestamp: number;
  replyTo?: string; // ID of the message being replied to
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { language, t, setLanguage } = useLanguage();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lastMessageSent, setLastMessageSent] = useState('');
  const [replyTo, setReplyTo] = useState<{id: string; content: string; isUser: boolean} | null>(null);
  const [passcodeEntered, setPasscodeEntered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Ref for message elements to scroll to when clicked
  const messageRefs = useRef<{[key: string]: HTMLDivElement}>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to scroll to a specific message when clicking a reply reference
  const scrollToMessage = (id: string) => {
    if (messageRefs.current[id]) {
      messageRefs.current[id].scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Highlight the message briefly
      messageRefs.current[id].classList.add('bg-indigo-700/30');
      setTimeout(() => {
        messageRefs.current[id]?.classList.remove('bg-indigo-700/30');
      }, 1500);
    }
  };

  // Handle initiating a reply to a message
  const handleReply = (id: string) => {
    const messageToReply = messages.find(msg => msg.id === id);
    if (messageToReply) {
      // Join all content parts with a space for display in the reply preview
      const content = messageToReply.content.join(' ');
      setReplyTo({
        id,
        content,
        isUser: messageToReply.role === 'user'
      });
    }
  };

  // Handle canceling a reply
  const handleCancelReply = () => {
    setReplyTo(null);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle language toggle
  const handleLanguageToggle = () => {
    // Toggle language between English and Kurdish
    const newLanguage = language === 'en' ? 'ku' : 'en';
    setLanguage(newLanguage);
  };

  // Kurdish responses for various message types (fallback if API fails)
  const kurdishResponses = {
    greeting: [
      "سڵاو! چۆنیت ئەمڕۆ؟",
      "سڵاو، خۆشحاڵم بە بینینت!",
      "بەخێربێیت! چۆن دەتوانم یارمەتیت بدەم؟"
    ],
    question: [
      "پرسیارێکی باشە. لەبارەی ئەمە بیر دەکەمەوە...",
      "بۆچوونی جیاواز هەیە لەسەر ئەوە. پێم وایە...",
      "ئەمە پرسیارێکی گرنگە. با هەوڵ بدەم وەڵامی بدەمەوە..."
    ],
    thanks: [
      "تکایە! خۆشحاڵم کە توانیم یارمەتیت بدەم.",
      "شتێکی ئەوتۆ نییە! هەر کاتێک پێویستت بە یارمەتی بوو لێرەم.",
      "بە دڵنیاییەوە! هەر شتێکی تر هەیە یارمەتیت بدەم؟"
    ],
    opinion: [
      "من پێم وایە ئەمە بیرۆکەیەکی باشە، بەڵام ئەوە تەنها بۆچوونی منە.",
      "کاتێک بیر لەوە دەکەمەوە، چەند خاڵی گرنگ هەن بۆ بیرکردنەوە...",
      "لە روانگەی منەوە، ئەمە کێشەیەکی ئاڵۆزە بە لایەنی جیاوازەوە."
    ],
    default: [
      "بۆچوونەکانت زۆر سەرنجڕاکێشن. دەتوانیت زیاتر لەبارەیەوە پێم بڵێیت؟",
      "ئەوە زۆر سەرنجڕاکێشە. چۆن گەیشتیت بەو ئەنجامە؟",
      "من تێدەگەم. چی دیکە دەتوانیت لەبارەی ئەمەوە بڵێیت؟",
      "بیرۆکەیەکی باشە. چۆن دەتوانین پەرەی پێ بدەین؟",
      "ئەمە بابەتێکی گرنگە. چۆن کاریگەری لەسەر تۆ دروست کردووە؟"
    ]
  };

  // English responses for various message types (fallback if API fails)
  const englishResponses = {
    greeting: [
      "Hello there! How are you doing today?",
      "Hi! Nice to see you!",
      "Welcome! How can I help you today?"
    ],
    question: [
      "That's a good question. Let me think about it...",
      "There are different perspectives on that. I think...",
      "That's an important question. Let me try to answer it..."
    ],
    thanks: [
      "You're welcome! I'm glad I could help.",
      "No problem! I'm here if you need any more assistance.",
      "Certainly! Anything else I can help you with?"
    ],
    opinion: [
      "I think that's a good idea, but that's just my opinion.",
      "When I consider this, there are several important points to think about...",
      "From my perspective, this is a complex issue with different sides."
    ],
    default: [
      "Your thoughts are quite interesting. Can you tell me more about it?",
      "That's very intriguing. How did you come to that conclusion?",
      "I understand. What else can you tell me about this?",
      "That's a good idea. How might we develop it further?",
      "This is an important topic. How has it affected you?"
    ]
  };

  // Generate a response using Google's Gemini API
  const generateGeminiResponse = async (userMessage: string, charName: string) => {
    try {
      // Prepare the prompt with character context
      let prompt = '';
      
      if (language === 'ku') {
        prompt = `تۆ ئەو کەسایەتییەی کە ناوت ${charName}ـە. تکایە وەڵامم بدەرەوە وەک ئەوەی تۆ ئەو کەسایەتییە بیت بە زمانی کوردی سۆرانی. وەڵامت کورت بکەرەوە (3-4 ڕستە زیاتر نەبێت). پرسیارەکەم: ${userMessage}`;
      } else {
        prompt = `You are a character named ${charName}. Please respond as if you are this character in a friendly, conversational way. Keep your response brief (no more than 3-4 sentences). The user's message is: ${userMessage}`;
      }
      
      // Make request to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the response text
      const aiResponseText = data.contents?.[0]?.parts?.[0]?.text || '';
      
      if (aiResponseText) {
        return {
          id: Date.now().toString(),
          role: 'model',
          content: parseMessage(aiResponseText),
          timestamp: Date.now()
        };
      } else {
        throw new Error('Empty response from API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Fall back to local responses if API fails
      return generateLocalFallbackResponse(userMessage);
    }
  };

  // Generate a local fallback response if the API fails
  const generateLocalFallbackResponse = (userMessage: string, replyToId?: string) => {
    // Process the message to categorize it
    const lowercaseMessage = userMessage.toLowerCase();
    let responseCategory = 'default';
    
    // Determine which language to use for responses
    const responses = language === 'ku' ? kurdishResponses : englishResponses;
    
    // Simple message categorization
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || 
        lowercaseMessage.includes('hey') || lowercaseMessage.match(/^(good|evening|morning|afternoon)/) ||
        lowercaseMessage.includes('سڵاو') || lowercaseMessage.includes('سلاو')) {
      responseCategory = 'greeting';
    } 
    else if (lowercaseMessage.includes('?') || 
             lowercaseMessage.includes('؟') ||
             lowercaseMessage.includes('what') || 
             lowercaseMessage.includes('how') ||
             lowercaseMessage.includes('why') ||
             lowercaseMessage.includes('when') ||
             lowercaseMessage.includes('چۆن') ||
             lowercaseMessage.includes('کەی')) {
      responseCategory = 'question';
    }
    else if (lowercaseMessage.includes('thank') || 
             lowercaseMessage.includes('thanks') ||
             lowercaseMessage.includes('سوپاس')) {
      responseCategory = 'thanks';
    }
    else if (lowercaseMessage.includes('think') || 
             lowercaseMessage.includes('opinion') ||
             lowercaseMessage.includes('feel about') ||
             lowercaseMessage.includes('بۆچوون') ||
             lowercaseMessage.includes('بیر')) {
      responseCategory = 'opinion';
    }
    
    // Get a random response from the appropriate category
    const categoryResponses = responses[responseCategory as keyof typeof responses];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    const response = categoryResponses[randomIndex];

    // Create a response message with reply information if provided
    return {
      id: Date.now().toString(),
      role: 'model',
      content: parseMessage(response),
      timestamp: Date.now(),
      replyTo: replyToId // Include the ID of the message being replied to
    };
  };

  // Handle sending a message
  const handleSendMessage = async (content: string, replyToId?: string) => {
    if (!character || isProcessing || !content.trim()) return;
    
    // Check if this is for character H and contains the passcode
    if (character.id.toLowerCase() === 'h' && content.includes('2103') && !passcodeEntered) {
      setPasscodeEntered(true);
    }
    
    setIsProcessing(true);
    setLastMessageSent(content); // Store the last message sent
    
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: parseMessage(content),
        timestamp: Date.now(),
        replyTo: replyToId // Include the ID of the message being replied to
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Wait a moment before showing typing indicator
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the message being replied to (if any)
      let replyToMessage: Message | undefined;
      let replyToContent: string = '';
      
      if (replyToId) {
        replyToMessage = messages.find(msg => msg.id === replyToId);
        if (replyToMessage) {
          replyToContent = replyToMessage.content.join(' ');
        }
      }
      
      // Use our API route instead of direct Gemini API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          character: character.id,
          characterName: character.name,
          characterPersonality: character.personalityPrompt,
          language: language,
          replyToContent: replyToContent, // Include the content of the message being replied to
          replyToMessageId: replyToId, // Include the ID of the message being replied to
          history: messages.map(msg => ({
            role: msg.role,
            parts: msg.content.map(text => ({ text })),
            id: msg.id,
            replyTo: msg.replyTo
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.reply) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'model',
          content: parseMessage(data.reply),
          timestamp: Date.now(),
          replyTo: userMessage.id // AI always replies to the most recent user message
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Empty response from API');
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Fall back to local response if API fails
      const fallbackResponse = generateLocalFallbackResponse(content, replyToId);
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsProcessing(false);
      // Clear reply state
      if (replyTo) {
        handleCancelReply();
      }
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to the user's preferences
  };

  useEffect(() => {
    // Fetch character data
    const id = params?.id as string;
    if (id) {
      // Try to find character in predefined list
      const foundCharacter = characters.find(char => char.id.toString() === id);
      
      if (foundCharacter) {
        setCharacter({
          id: foundCharacter.id.toString(),
          name: foundCharacter.name,
          image: null, // Replace with real image if available
          description: foundCharacter.description,
          greeting: foundCharacter.greeting || `Hi there! I'm ${foundCharacter.name}. How can I help you today?`,
          rating: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)), // Random rating between 4.2-5.0
          totalChats: Math.floor(Math.random() * 25000) + 5000, // Random popularity count
          category: foundCharacter.category || foundCharacter.tags?.[0] || "General",
          personalityPrompt: foundCharacter.personalityPrompt
        });
      } else {
        // Fallback to mock character
        const mockCharacter: Character = {
          id,
          name: "AI Character",
          image: null,
          description: "An AI character",
          greeting: "Hello! I'm your AI assistant. How can I help you today?",
          rating: 4.8,
          totalChats: 12500,
          category: "Assistant",
          personalityPrompt: "You are a character named AI Character. Please respond as if you are this character in a friendly, conversational way. Keep your response brief (no more than 3-4 sentences)."
        };
        setCharacter(mockCharacter);
      }
    }
  }, [params?.id]);

  // Add initial greeting when character is loaded
  useEffect(() => {
    if (character && messages.length === 0) {
      let initialGreeting;
      
      // Special case for character H
      if (character.id.toLowerCase() === 'h') {
        initialGreeting = language === 'ku' 
          ? 'تکایە پاسوۆردەکە بنووسە بۆ ئەوەی لەگەڵم قسە بکەیت.'
          : 'Please enter the passcode to chat with me.';
      } else {
        initialGreeting = language === 'ku' 
          ? `سڵاو! من ${character.name}م. چۆن دەتوانم یارمەتیت بدەم؟`
          : `Hi there! I'm ${character.name}. How can I help you today?`;
      }
        
      const greetingMessage: Message = {
        id: 'greeting',
        role: 'model',
        content: parseMessage(initialGreeting),
        timestamp: Date.now()
      };
      setMessages([greetingMessage]);
    }
  }, [character, messages.length, language]);

  // Change greetings when language changes
  useEffect(() => {
    if (character && messages.length > 0 && messages[0].id === 'greeting') {
      let initialGreeting;
      
      // Special case for character H
      if (character.id.toLowerCase() === 'h') {
        initialGreeting = language === 'ku' 
          ? 'تکایە پاسوۆردەکە بنووسە بۆ ئەوەی لەگەڵم قسە بکەیت.'
          : 'Please enter the passcode to chat with me.';
      } else {
        initialGreeting = language === 'ku' 
          ? `سڵاو! من ${character.name}م. چۆن دەتوانم یارمەتیت بدەم؟`
          : `Hi there! I'm ${character.name}. How can I help you today?`;
      }
      
      const updatedGreeting: Message = {
        id: 'greeting',
        role: 'model',
        content: parseMessage(initialGreeting),
        timestamp: messages[0].timestamp
      };
      
      setMessages(prev => [updatedGreeting, ...prev.slice(1)]);
    }
  }, [language, character]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);
  
  // Handle mobile viewport height adjustments for keyboard
  useEffect(() => {
    // Function to set viewport height variable
    const setVH = () => {
      // Set a custom property for viewport height that will be used instead of 100vh
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set initial viewport height
    setVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // When on mobile, clicking outside the sidebar should close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If sidebar is open and user clicks outside of it, close it
      if (isSidebarOpen && (event.target as Element).closest('.chat-sidebar') === null) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSidebarOpen]);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-b from-indigo-950 to-purple-950">
        <div className="animate-pulse text-indigo-300">
          {language === 'ku' ? 'دامەزراندنی کارەکتەر...' : 'Loading character...'}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col bg-gradient-to-b from-indigo-950 to-purple-950" 
      data-page="chat"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <ChatHeader
        characterName={character.name}
        characterImage={character.image}
        avatarGradient={getAvatarGradient(character.name)}
        status={isProcessing ? (language === 'ku' ? 'نووسینەوە...' : 'typing...') : 'online'}
        onInfoClick={() => {}}
        onLanguageToggle={handleLanguageToggle}
        onMenuClick={() => setIsSidebarOpen(true)}
        currentLanguage={language}
      />
      
      {/* Mobile sidebar */}
      <ChatSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Character profile navbar - fixed alignment */}
      <div className="w-full bg-indigo-900/80 backdrop-blur-md border-b border-purple-500/30 pt-20 transition-all duration-200">
        <div className="max-w-4xl mx-auto px-3 py-3 sm:py-4 flex items-center justify-between">
          {/* Left side - Character info */}
          <div className="flex items-center">
            <div className="relative mr-3 sm:mr-4">
              <div className="p-0.5 bg-gradient-to-br from-purple-500/50 to-indigo-600/50 rounded-full">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-1 ring-purple-500/20">
                  {character.image ? (
                    <AvatarImage src={character.image} alt={character.name} className="object-cover" />
                  ) : (
                    <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(character.name)}`}>
                      {character.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
            
            <div>
              <h2 className="font-bold text-lg sm:text-xl text-white">{character.name}</h2>
              <div className="flex items-center text-xs sm:text-sm text-purple-200 mt-0.5 sm:mt-1">
                <div className="flex items-center mr-3 sm:mr-4">
                  <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 mr-1 sm:mr-1.5" />
                  <span>{character.rating}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-300 mr-1 sm:mr-1.5" />
                  <span>{(character.totalChats || 0).toLocaleString()} {language === 'ku' ? 'گفتوگۆ' : 'chats'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleFavorite} className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-800/40 hover:bg-indigo-700/60 transition-colors">
              <Heart className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-purple-300'}`} />
            </button>
            <button className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-800/40 hover:bg-indigo-700/60 transition-colors">
              <Info className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-purple-300" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
        <div className="flex flex-col gap-3 py-3 sm:py-4 px-2 sm:px-4 max-w-4xl mx-auto">
          {messages.length > 0 ? (
            messages.map((message) => {
              // Find content of the replied message if this message is a reply
              const replyToMessage = message.replyTo 
                ? messages.find(msg => msg.id === message.replyTo) 
                : undefined;
              
              const replyContent = replyToMessage 
                ? replyToMessage.content.join(' ') 
                : undefined;
              
              return (
                <div
                  key={message.id}
                  ref={el => {
                    if (el) messageRefs.current[message.id] = el;
                  }}
                  className="transition-colors duration-300 rounded-xl"
                >
                  <ChatMessage
                    id={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    characterName={character.name}
                    characterImage={character.image}
                    avatarGradient={getAvatarGradient(character.name)}
                    onDelete={handleDeleteMessage}
                    onReply={handleReply}
                    replyTo={message.replyTo}
                    replyContent={replyContent}
                    scrollToMessage={scrollToMessage}
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-indigo-300 opacity-70">
              <p>{language === 'ku' ? `نامەیەک بنێرە بۆ دەستپێکردنی گفتوگۆ لەگەڵ ${character.name}` : `Send a message to start chatting with ${character.name}`}</p>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center gap-2 mb-1 px-1">
              <div className="flex-shrink-0">
                <div className="p-0.5 rounded-full bg-gradient-to-br from-purple-500/50 to-indigo-600/50">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    {character.name[0]}
                  </div>
                </div>
              </div>
              <div className="bg-indigo-900/40 backdrop-blur-md text-gray-100 px-3 py-1.5 rounded-2xl text-sm">
                <div className="flex space-x-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce delay-100">•</span>
                  <span className="animate-bounce delay-200">•</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        placeholder={language === 'ku' ? `نامە بۆ ${character.name}...` : `Message ${character.name}...`}
        className="sticky bottom-0 max-w-4xl mx-auto w-full z-10 pb-safe"
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
}
