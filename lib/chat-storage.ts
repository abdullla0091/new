// Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'model';
  content: string;
  timestamp: number;
  lang?: 'en' | 'ku';
}

// For compatibility with the chat page component
export interface StoredChatMessage {
  id: string;
  role: 'user' | 'model' | 'system' | 'assistant';
  content: string;
  timestamp: number;
  lang?: 'en' | 'ku';
}

export interface StoredChat {
  id: string;
  characterId: string;
  title: string;
  createdAt: number;
  lastUpdated: number;
  messages: ChatMessage[];
  favorite?: boolean;
  pinned?: boolean;
}

// Convert stored message to chat UI format
export function convertStoredMessageToChatMessage(
  message: StoredChatMessage
) {
  return {
    id: message.id,
    role: message.role === 'assistant' ? 'model' : message.role,
    parts: [{ text: message.content }],
    lang: message.lang || 'en'
  };
}

// Storage keys
const STORAGE_KEY = 'ai-chat-app-chats';
const MAX_CHATS = 50; // Maximum number of chats to store

// Helper to generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get all chats from localStorage
export const getAllChats = (): StoredChat[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const chats = localStorage.getItem(STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error loading chats from localStorage:', error);
    return [];
  }
};

// Get a specific chat by ID
export const getChatById = (chatId: string): StoredChat | null => {
  const chats = getAllChats();
  return chats.find(chat => chat.id === chatId) || null;
};

// Get chats for a specific character
export const getChatsByCharacter = (characterId: string): StoredChat[] => {
  const chats = getAllChats();
  return chats.filter(chat => chat.characterId === characterId);
};

// Get recent chats, optionally limited
export const getRecentChats = (limit?: number): StoredChat[] => {
  const chats = getAllChats();
  
  // Sort by last updated, newest first
  const sortedChats = chats.sort((a, b) => b.lastUpdated - a.lastUpdated);
  
  return limit ? sortedChats.slice(0, limit) : sortedChats;
};

// Get favorite/pinned chats
export const getFavoriteChats = (): StoredChat[] => {
  const chats = getAllChats();
  return chats.filter(chat => chat.favorite);
};

export const getPinnedChats = (): StoredChat[] => {
  const chats = getAllChats();
  return chats.filter(chat => chat.pinned);
};

// Create a new chat
export const createNewChat = (characterId: string, initialMessage?: ChatMessage | StoredChatMessage): StoredChat => {
  const chats = getAllChats();
  
  const newChat: StoredChat = {
    id: generateId(),
    characterId,
    title: `Chat with ${characterId}`, // Will be updated later
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    messages: initialMessage ? [initialMessage as ChatMessage] : [],
    favorite: false,
    pinned: false
  };
  
  // Add to beginning of array
  chats.unshift(newChat);
  
  // Limit total number of chats
  const limitedChats = chats.slice(0, MAX_CHATS);
  
  // Save to localStorage
  saveChats(limitedChats);
  
  return newChat;
};

// Update an existing chat
export const updateChat = (chatId: string, updates: Partial<StoredChat>): StoredChat | null => {
  const chats = getAllChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  // Apply updates
  chats[chatIndex] = {
    ...chats[chatIndex],
    ...updates,
    lastUpdated: Date.now() // Always update timestamp
  };
  
  // Save to localStorage
  saveChats(chats);
  
  return chats[chatIndex];
};

// Add a message to a chat
export const addMessageToChat = (chatId: string, message: Omit<ChatMessage, 'id'> | Omit<StoredChatMessage, 'id'>): StoredChat | null => {
  const chats = getAllChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  // Create full message with ID
  const fullMessage: ChatMessage = {
    ...message as any,
    id: generateId(),
    timestamp: message.timestamp || Date.now()
  };
  
  // Add message
  chats[chatIndex].messages.push(fullMessage);
  chats[chatIndex].lastUpdated = Date.now();
  
  // If this is the first user message, use it to generate a better title
  if (chats[chatIndex].messages.length === 2 && message.role === 'user') {
    // Generate a title from the first user message (truncate if needed)
    chats[chatIndex].title = message.content.length > 30 
      ? `${message.content.substring(0, 30)}...` 
      : message.content;
  }
  
  // Save to localStorage
  saveChats(chats);
  
  return chats[chatIndex];
};

// Delete a chat
export const deleteChat = (chatId: string): boolean => {
  const chats = getAllChats();
  const filteredChats = chats.filter(chat => chat.id !== chatId);
  
  if (filteredChats.length === chats.length) {
    return false; // Chat not found
  }
  
  // Save to localStorage
  saveChats(filteredChats);
  
  return true;
};

// Toggle favorite status
export const toggleFavorite = (chatId: string): StoredChat | null => {
  const chats = getAllChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  // Toggle favorite status
  chats[chatIndex].favorite = !chats[chatIndex].favorite;
  chats[chatIndex].lastUpdated = Date.now();
  
  // Save to localStorage
  saveChats(chats);
  
  return chats[chatIndex];
};

// Toggle pinned status
export const togglePinned = (chatId: string): StoredChat | null => {
  const chats = getAllChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  // Toggle pinned status
  chats[chatIndex].pinned = !chats[chatIndex].pinned;
  chats[chatIndex].lastUpdated = Date.now();
  
  // Save to localStorage
  saveChats(chats);
  
  return chats[chatIndex];
};

// Private helper to save chats to localStorage
const saveChats = (chats: StoredChat[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
  }
}; 