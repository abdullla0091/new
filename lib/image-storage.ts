// Local storage key for storing user images
const USER_IMAGE_KEY = 'user-profile-image';
const CHARACTER_IMAGES_KEY = 'character-images';

// For demo purposes, we'll use localStorage to persist images
// In a real application, you would use a storage service like S3, Firebase Storage, etc.

/**
 * Save user profile image to localStorage
 */
export function saveUserImage(imageData: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_IMAGE_KEY, imageData);
  } catch (error) {
    console.error('Error saving user image to localStorage:', error);
  }
}

/**
 * Get user profile image from localStorage
 */
export function getUserImage(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(USER_IMAGE_KEY);
  } catch (error) {
    console.error('Error getting user image from localStorage:', error);
    return null;
  }
}

/**
 * Remove user profile image from localStorage
 */
export function removeUserImage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USER_IMAGE_KEY);
  } catch (error) {
    console.error('Error removing user image from localStorage:', error);
  }
}

/**
 * Save character image to localStorage
 */
export function saveCharacterImage(characterId: string, imageData: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const imagesData = getCharacterImages();
    imagesData[characterId] = imageData;
    localStorage.setItem(CHARACTER_IMAGES_KEY, JSON.stringify(imagesData));
  } catch (error) {
    console.error('Error saving character image to localStorage:', error);
  }
}

/**
 * Get all character images from localStorage
 */
export function getCharacterImages(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  try {
    const imagesData = localStorage.getItem(CHARACTER_IMAGES_KEY);
    return imagesData ? JSON.parse(imagesData) : {};
  } catch (error) {
    console.error('Error getting character images from localStorage:', error);
    return {};
  }
}

/**
 * Get specific character image from localStorage
 */
export function getCharacterImage(characterId: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const imagesData = getCharacterImages();
    return imagesData[characterId] || null;
  } catch (error) {
    console.error('Error getting character image from localStorage:', error);
    return null;
  }
}

/**
 * Remove character image from localStorage
 */
export function removeCharacterImage(characterId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const imagesData = getCharacterImages();
    delete imagesData[characterId];
    localStorage.setItem(CHARACTER_IMAGES_KEY, JSON.stringify(imagesData));
  } catch (error) {
    console.error('Error removing character image from localStorage:', error);
  }
}

/**
 * Convert a file to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Get a dummy image URL for a character based on its ID
 */
export function getDummyCharacterImage(characterId: string): string {
  // For simplicity, we'll use a pattern based on the character ID
  const id = characterId.toLowerCase().charCodeAt(0) % 8 + 1;
  return `/images/characters/avatar-${id}.jpg`;
} 