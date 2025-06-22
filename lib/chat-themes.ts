// Define simplified chat theme types
export type ChatTheme = {
  id: string;
  name: string;
  description?: string;
  colors: {
    background: string;
    messageUser: string;
    messageBot: string;
    inputBackground: string;
    textLight: string;
    textDark: string;
  };
  isDark: boolean;
};

// Theme storage key for localStorage
export const CHAT_THEME_STORAGE_KEY = 'chat-theme-preference';

// Simplified chat themes
export const chatThemes: ChatTheme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright chat theme',
    colors: {
      background: '#f8fafc',
      messageUser: 'linear-gradient(to bottom right, #8b5cf6, #3b82f6)',
      messageBot: '#e2e8f0',
      inputBackground: '#ffffff',
      textLight: '#f8fafc',
      textDark: '#0f172a'
    },
    isDark: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark chat theme',
    colors: {
      background: '#0f172a',
      messageUser: 'linear-gradient(to bottom right, #8b5cf6, #3b82f6)',
      messageBot: '#1e293b',
      inputBackground: '#1e293b',
      textLight: '#f8fafc',
      textDark: '#0f172a'
    },
    isDark: true,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm evening colors',
    colors: {
      background: '#FFECD6',
      messageUser: 'linear-gradient(to bottom right, #f97316, #ef4444)',
      messageBot: '#FFF5E9',
      inputBackground: '#ffffff',
      textLight: '#ffffff',
      textDark: '#7c2d12'
    },
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Calming green tones',
    colors: {
      background: '#ecfdf5',
      messageUser: 'linear-gradient(to bottom right, #10b981, #059669)',
      messageBot: '#f1f5f9',
      inputBackground: '#ffffff',
      textLight: '#ffffff',
      textDark: '#064e3b'
    },
    isDark: false,
  },
  {
    id: 'kurdish',
    name: 'Kurdish',
    description: 'Kurdish flag inspired',
    colors: {
      background: '#fcfbf4',
      messageUser: 'linear-gradient(to bottom right, #ca8a04, #facc15)',
      messageBot: '#f8fafc',
      inputBackground: '#ffffff',
      textLight: '#ffffff',
      textDark: '#0f172a'
    },
    isDark: false,
  }
];

// Function to safely access localStorage
function safeLocalStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
}

// Function to get the current theme from localStorage or default to 'light'
export function getCurrentChatTheme(): string {
  const storage = safeLocalStorage();
  if (!storage) return 'light';
  
  try {
    const savedTheme = storage.getItem(CHAT_THEME_STORAGE_KEY);
    return savedTheme || 'light';
  } catch (error) {
    console.error('Error reading chat theme from localStorage:', error);
    return 'light';
  }
}

// Helper function to get theme by ID
export function getChatThemeById(themeId: string): ChatTheme | undefined {
  return chatThemes.find(theme => theme.id === themeId);
}

// Function to set the current chat theme in localStorage
export function setChatTheme(themeId: string): void {
  const storage = safeLocalStorage();
  if (!storage) return;
  
  try {
    storage.setItem(CHAT_THEME_STORAGE_KEY, themeId);
    
    // Apply the theme immediately
    applyChatTheme(themeId);
    
    // Dispatch a custom event that theme-related components can listen for
    window.dispatchEvent(new Event('chat-theme-changed'));
  } catch (error) {
    console.error('Error saving chat theme to localStorage:', error);
  }
}

// Apply chat theme to the chat UI only
export function applyChatTheme(themeId: string): void {
  const storage = safeLocalStorage();
  if (!storage) return;
  
  try {
    // Get theme option
    const themeOption = getChatThemeById(themeId);
    if (!themeOption) return;
    
    // Store theme preference
    storage.setItem(CHAT_THEME_STORAGE_KEY, themeId);
    
    // Apply CSS variables for chat components only
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Apply chat-specific CSS variables
      root.style.setProperty('--chat-bg', themeOption.colors.background);
      root.style.setProperty('--message-user-bg', themeOption.colors.messageUser);
      root.style.setProperty('--message-bot-bg', themeOption.colors.messageBot);
      root.style.setProperty('--chat-input-bg', themeOption.colors.inputBackground);
      root.style.setProperty('--chat-text-light', themeOption.colors.textLight);
      root.style.setProperty('--chat-text-dark', themeOption.colors.textDark);
      
      // Add data attribute for theme
      root.setAttribute('data-chat-theme', themeId);
    }
    
    // Dispatch theme change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('chat-theme-changed'));
    }
  } catch (error) {
    console.error('Error applying chat theme:', error);
  }
}
