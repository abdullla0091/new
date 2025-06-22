"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Home, Search, MessageCircle, User, Heart, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isKurdish = language === 'ku';

  // Prevent scrolling on the body when the sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: t('home'),
      path: '/home',
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: t('explore'),
      path: '/explore',
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: isKurdish ? 'گفتوگۆ' : 'Chat',
      path: '/chat',
      active: true,
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: t('favorites'),
      path: '/favorites',
    },
    {
      icon: <User className="h-5 w-5" />,
      label: t('profile'),
      path: '/profile',
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: isKurdish ? 'ڕێکخستنەکان' : 'Settings',
      path: '/settings',
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: isKurdish ? 'دەربارە' : 'About',
      path: '/about',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay to close sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`chat-sidebar fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-950 to-purple-950 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{touchAction: 'pan-y'}}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-purple-800/30">
            <h2 className="text-lg font-bold text-white">
              {isKurdish ? 'مێنیو' : 'Menu'}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-purple-300 hover:text-white hover:bg-purple-800/30"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={`w-full justify-start ${item.active ? 'bg-indigo-800/60' : ''} hover:bg-indigo-800/40 text-white flex items-center h-10 px-3`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <div className="flex items-center w-full">
                      <span className="flex-shrink-0 flex items-center justify-center w-6">
                        {item.icon}
                      </span>
                      <span className={`ml-3 ${isKurdish ? 'kurdish' : ''}`} dir={isKurdish ? 'rtl' : 'ltr'}>
                        {item.label}
                      </span>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-purple-800/30 flex justify-center">
            <div className="text-xs text-indigo-300 opacity-70">
              {isKurdish ? 'نەرمەکاڵای چات کورد v1.0' : 'ChatKurd App v1.0'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 