"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/language-toggle';
import { LogIn, HomeIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ModernNavbar() {
  const { t, language } = useLanguage();
  const isKurdish = language === "ku";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Check which section is currently in view
      const sections = ['characters', 'features', 'how-it-works'];
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navLinks = [
    { href: '#characters', label: t('characters') },
    { href: '#features', label: t('features') },
    { href: '#how-it-works', label: t('howItWorks') },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      // Try multiple approaches for maximum browser compatibility
      
      // Approach 1: Using scrollIntoView (most reliable across browsers)
      try {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return; // If successful, we're done
      } catch (error) {
        console.warn('scrollIntoView failed, trying alternative methods', error);
      }
      
      // Approach 2: Calculate position manually
      try {
        // Get the element's position relative to the viewport
        const rect = targetElement.getBoundingClientRect();
        
        // Calculate the scroll position:
        // Current scroll position + element's top position - navbar height
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + rect.top - 80; // 80px for navbar height
        
        // Using scrollTo with smooth behavior
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for browsers that don't support smooth scrolling
        console.warn('Smooth scrolling not supported, using basic fallback', error);
        
        // Approach 3: Simple scrollTo without smooth behavior (works in all browsers)
        const yCoordinate = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = -80; // navbar height
        window.scrollTo(0, yCoordinate + yOffset);
      }
    }
  };

  return (
    <header 
      className={`modern-navbar w-full py-4 px-6 md:px-8 fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? 'scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-14 w-14">
            <Image 
              src="/images/logoo.png" 
              alt="Nestro Chat Logo"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
          <span className={`font-display font-bold text-xl tracking-tighter ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>Nestro Chat</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.div 
            className="flex gap-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`modern-navbar-link text-white/90 hover:text-white ${
                  activeSection === link.href.replace('#', '') ? 'active' : ''
                } ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <LanguageToggle />
            </motion.div>
          </motion.div>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/home" passHref>
              <Button
                variant="ghost"
                className={`nav-button-hover text-white hover:bg-white/10 font-medium ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                style={{ unicodeBidi: 'plaintext' }}
                onClick={() => window.location.href = '/home'}
              >
                <HomeIcon className={`h-4 w-4 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                <span>{t("dashboard")}</span>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/auth/signin" passHref>
              <Button
                variant="outline"
                className={`nav-button-hover border-purple-400 text-purple-300 hover:bg-purple-500 hover:text-white transition-colors font-medium ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                style={{ unicodeBidi: 'plaintext' }}
                onClick={() => window.location.href = '/auth/signin'}
              >
                <LogIn className={`h-4 w-4 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                <span>{t("signIn")}</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Icon */}
        <motion.button
          className="md:hidden p-1 text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`md:hidden absolute top-full left-0 right-0 bg-indigo-950/95 backdrop-blur-lg border-b border-purple-500/20 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-white py-2 border-b border-purple-800/30 ${
                    activeSection === link.href.replace('#', '') ? 'border-purple-400' : ''
                  } ${isKurdish ? 'kurdish use-local-kurdish text-right' : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{ unicodeBidi: 'plaintext' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-4">
                <Button 
                  className={`w-full bg-indigo-800/50 text-white hover:bg-indigo-700 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`} 
                  style={{ unicodeBidi: 'plaintext' }}
                  onClick={() => window.location.href = '/home'}
                >
                  <HomeIcon className={`h-4 w-4 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                  <span>{t("dashboard")}</span>
                </Button>
                <Button 
                  variant="outline"
                  className={`w-full border-purple-400 text-purple-300 hover:bg-purple-500 hover:text-white ${isKurdish ? 'kurdish use-local-kurdish' : ''}`} 
                  style={{ unicodeBidi: 'plaintext' }}
                  onClick={() => window.location.href = '/auth/signin'}
                >
                  <LogIn className={`h-4 w-4 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                  <span>{t("signIn")}</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 