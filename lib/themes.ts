// Define theme types
export type ThemeOption = {
  id: string;
  name: string;
  description?: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    border: string;
    primary: string;
    primaryForeground: string;
    accent?: string;
    muted?: string;
  };
  isDark: boolean;
};

// Theme storage key for localStorage
export const THEME_STORAGE_KEY = 'app-theme-preference';

// Default themes
export const themes: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright theme',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      card: '#ffffff',
      border: '#e5e7eb',
      primary: '#2563eb',
      primaryForeground: '#ffffff',
      accent: '#f3f4f6',
      muted: '#f9fafb',
    },
    isDark: false,
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes at night',
    colors: {
      background: '#1f2937',
      foreground: '#f9fafb',
      card: '#111827',
      border: '#374151',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      accent: '#374151',
      muted: '#1f2937',
    },
    isDark: true,
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blue dark theme',
    colors: {
      background: '#0f172a',
      foreground: '#f8fafc',
      card: '#1e293b',
      border: '#334155',
      primary: '#38bdf8',
      primaryForeground: '#0f172a',
      accent: '#1e293b',
      muted: '#0f172a',
    },
    isDark: true,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm evening colors',
    colors: {
      background: '#fef2f2',
      foreground: '#7f1d1d',
      card: '#ffffff',
      border: '#fee2e2',
      primary: '#ef4444',
      primaryForeground: '#ffffff',
      accent: '#fef2f2',
      muted: '#fef2f2',
    },
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Calming green tones',
    colors: {
      background: '#f0fdf4',
      foreground: '#14532d',
      card: '#ffffff',
      border: '#dcfce7',
      primary: '#16a34a',
      primaryForeground: '#ffffff',
      accent: '#f0fdf4',
      muted: '#f0fdf4',
    },
    isDark: false,
  },
  {
    id: 'dusk',
    name: 'Kurdish Dusk',
    description: 'Inspired by Kurdish landscapes at dusk',
    colors: {
      background: '#292524',
      foreground: '#fafaf9',
      card: '#44403c',
      border: '#57534e',
      primary: '#eab308', // Yellow from Kurdish flag
      primaryForeground: '#292524',
      accent: '#44403c',
      muted: '#292524',
    },
    isDark: true,
  }
];

// Helper function to get theme by ID
export function getThemeById(themeId: string): ThemeOption | undefined {
  return themes.find(theme => theme.id === themeId);
}

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

// Function to get the current theme from localStorage or default to 'system'
export function getCurrentTheme(): string {
  const storage = safeLocalStorage();
  if (!storage) return 'system';
  
  try {
    const savedTheme = storage.getItem(THEME_STORAGE_KEY);
    return savedTheme || 'system';
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return 'system';
  }
}

// Function to set the current theme in localStorage
export function setCurrentTheme(themeId: string): void {
  const storage = safeLocalStorage();
  if (!storage) return;
  
  try {
    storage.setItem(THEME_STORAGE_KEY, themeId);
    
    // Dispatch a custom event that theme-related components can listen for
    window.dispatchEvent(new Event('theme-changed'));
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
} 