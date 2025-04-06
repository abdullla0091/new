// Local storage key for favorite characters
const FAVORITES_KEY = 'favorite-characters';

/**
 * Get all favorite character IDs from localStorage
 */
export function getFavoriteCharacters(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
}

/**
 * Check if a character is favorited
 */
export function isCharacterFavorite(characterId: string): boolean {
  const favorites = getFavoriteCharacters();
  return favorites.includes(characterId);
}

/**
 * Toggle favorite status for a character
 * @returns The new favorite status (true = favorited, false = unfavorited)
 */
export function toggleFavoriteCharacter(characterId: string): boolean {
  const favorites = getFavoriteCharacters();
  const index = favorites.indexOf(characterId);
  
  // If character is already a favorite, remove it
  if (index !== -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    
    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('favorites-changed'));
    }
    
    return false;
  }
  
  // Otherwise, add it to favorites
  favorites.push(characterId);
  saveFavorites(favorites);
  
  // Dispatch custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('favorites-changed'));
  }
  
  return true;
}

/**
 * Save favorites to localStorage
 */
function saveFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
} 