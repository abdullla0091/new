"use client";

import React from 'react';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface MixedContentProps {
  children: React.ReactNode;
  className?: string;
  forceDir?: 'ltr' | 'rtl';
}

/**
 * MixedContent component handles text that contains both RTL and LTR characters
 * ensuring proper text alignment and direction regardless of the app's language
 */
export default function MixedContent({ 
  children, 
  className = '',
  forceDir
}: MixedContentProps) {
  const { language } = useLanguage();
  const isKurdish = language === 'ku';
  
  // Determine text direction based on app language or forced direction
  const dir = forceDir || (isKurdish ? 'rtl' : 'ltr');
  
  // Apply appropriate classes based on direction
  const baseClasses = isKurdish ? 'kurdish use-local-kurdish' : '';
  
  return (
    <span 
      className={`${baseClasses} ${className}`}
      dir={dir}
      style={{ unicodeBidi: 'plaintext' }}
    >
      {children}
    </span>
  );
}

/**
 * EnglishContent component is specifically for displaying English content
 * within RTL context without being reversed
 */
export function EnglishContent({ 
  children, 
  className = ''
}: Omit<MixedContentProps, 'forceDir'>) {
  return (
    <span 
      className={`en latin ${className}`}
      dir="ltr"
      style={{ 
        display: 'inline-block',
        direction: 'ltr',
        unicodeBidi: 'embed'
      }}
    >
      {children}
    </span>
  );
}

/**
 * NumberContent component is for displaying numbers correctly in any context
 */
export function NumberContent({ 
  children, 
  className = ''
}: Omit<MixedContentProps, 'forceDir'>) {
  return (
    <span 
      className={`digit number ${className}`}
      style={{ 
        display: 'inline-block',
        direction: 'ltr',
        unicodeBidi: 'isolate-override'
      }}
    >
      {children}
    </span>
  );
} 