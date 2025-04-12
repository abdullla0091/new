"use client";

import Link from "next/link"
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles, LogIn, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { useLanguage } from "./i18n/LanguageContext"
import LanguageToggle from "@/components/language-toggle"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Dynamically import components with client-side rendering
const CharacterEyes = dynamic(() => import("@/components/landing/character-eyes"), { ssr: false })
const SimplifiedBackground = dynamic(() => import("@/components/landing/simplified-background"), { ssr: false })
const FeatureCard = dynamic(() => import("@/components/landing/feature-card"), { ssr: false })
const CharacterShowcase = dynamic(() => import("@/components/landing/character-showcase"), { ssr: false })
const ModernNavbar = dynamic(() => import("@/components/landing/modern-navbar"), { ssr: false })

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

export default function Home() {
  const { t, language } = useLanguage();
  const [isCounterAnimated, setIsCounterAnimated] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const isKurdish = language === "ku";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isCounterAnimated) {
          setIsCounterAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.2 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isCounterAnimated]);
  
  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter-effect');
    
    counters.forEach(counter => {
      const target = parseFloat(counter.textContent.replace('K', ''));
      const isThousand = counter.textContent.includes('K');
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepTime = duration / steps;
      let current = 0;
      
      const updateCounter = () => {
        const increment = target / steps;
        current += increment;
        
        if (current < target) {
          counter.textContent = isThousand 
            ? (Math.round(current * 10) / 10).toFixed(1) + 'K'
            : Math.round(current).toString();
          setTimeout(updateCounter, stepTime);
        } else {
          counter.textContent = isThousand 
            ? (Math.round(target * 10) / 10).toFixed(1) + 'K'
            : Math.round(target).toString();
        }
      };
      
      updateCounter();
    });
  };

  return (
    <div className={`fixed inset-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white ${isKurdish ? 'kurdish use-local-kurdish' : ''}`} dir={isKurdish ? 'rtl' : 'ltr'}>
      {/* Modern Navbar */}
      <ModernNavbar />

      {/* Hero Section with Simplified Background */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Simplified Background */}
        <SimplifiedBackground />

        {/* Add a subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-transparent to-indigo-950/70 z-[1]"></div>

        <div className="w-full px-4 py-20 relative z-10 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="bg-indigo-900/20 backdrop-blur-md p-8 md:p-12 rounded-3xl max-w-4xl mx-auto border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
          >
            <motion.div 
              variants={fadeIn}
              className="relative h-24 md:h-32 mb-4"
            >
              <CharacterEyes />
            </motion.div>
            <motion.h1 
              variants={fadeIn}
              className={`font-display text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("chatWith")} <span className="text-purple-400">{t("uniqueCharacters")}</span>, {t("notJustBot")}
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className={`font-sans text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("experienceConversations")}
            </motion.p>
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 rounded-lg text-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:-translate-y-1 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                onClick={() => window.location.href = '/explore'}
              >
                {t("meetOurCharacters")}
                <ArrowRight className={`${isKurdish ? 'mr-2' : 'ml-2'} h-5 w-5 icon-rtl-aware`} />
              </Button>
              <Button 
                variant="outline" 
                className={`border-purple-400 text-purple-300 hover:bg-purple-500 hover:text-white transition-colors px-6 py-6 rounded-lg text-lg ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
                onClick={() => window.location.href = '/home'}
              >
                <HomeIcon className={`${isKurdish ? 'ml-2' : 'mr-2'} h-5 w-5`} />
                {t("dashboard")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Character Showcase Section */}
      <section id="characters" className="w-full px-4 py-20 relative scroll-mt-20">
        {/* Add decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"
        ></motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 relative z-10"
        >
          <motion.span 
            variants={fadeIn}
            className={`font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
          >
            {t("meetTheTeam")}
          </motion.span>
          <motion.h2 
            variants={fadeIn}
            className={`font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
          >
            {t("meetCharactersTitle")}
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className={`font-sans text-gray-300 max-w-2xl mx-auto ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
          >
            {t("eachWithPersonality")}
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <CharacterShowcase />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative py-20 overflow-hidden scroll-mt-20">
        {/* Add background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950/50 to-indigo-950"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-indigo-950 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-indigo-950 to-transparent"></div>

        {/* Add floating shapes */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></motion.div>

        <div className="w-full px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className={`font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("capabilities")}
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className={`font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("uniqueFeatures")}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className={`font-sans text-gray-300 max-w-2xl mx-auto ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("discoverSpecial")}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn}>
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-purple-400" />}
                title={t("distinctPersonalities")}
                description={t("personalitiesDesc")}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-purple-400" />}
                title={t("contextualMemory")}
                description={t("memoryDesc")}
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-purple-400" />}
                title={t("safeInteractions")}
                description={t("safeDesc")}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20 overflow-hidden scroll-mt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950 to-indigo-950"></div>
        
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="w-full px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className={`font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("growingCommunity")}
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className={`font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("ourImpact")}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className={`font-sans text-gray-300 max-w-2xl mx-auto ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("communityDescription")}
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Active Users Stat */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center bg-indigo-800/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-[0_5px_30px_rgba(139,92,246,0.15)] hover:shadow-[0_5px_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
                <span className="counter-effect digit">25.3K</span>
              </div>
              <p className={`font-sans text-purple-300 text-lg ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("activeUsers")}</p>
            </motion.div>
            
            {/* Conversations Stat */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center bg-indigo-800/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-[0_5px_30px_rgba(139,92,246,0.15)] hover:shadow-[0_5px_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
                <span className="counter-effect digit">143K</span>
              </div>
              <p className={`font-sans text-purple-300 text-lg ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("conversations")}</p>
            </motion.div>
            
            {/* Characters Stat */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center bg-indigo-800/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-[0_5px_30px_rgba(139,92,246,0.15)] hover:shadow-[0_5px_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
                <span className="counter-effect digit">42</span>
              </div>
              <p className={`font-sans text-purple-300 text-lg ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("characters")}</p>
            </motion.div>
            
            {/* Languages Stat */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center bg-indigo-800/20 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-[0_5px_30px_rgba(139,92,246,0.15)] hover:shadow-[0_5px_30px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-display text-4xl md:text-5xl font-bold mb-2 text-white">
                <span className="counter-effect digit">2</span>
              </div>
              <p className={`font-sans text-purple-300 text-lg ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("languages")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="relative py-20 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-indigo-900/50 backdrop-blur-lg"></div>

        {/* Add animated gradient background */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 animate-gradient-slow"></div>
        </motion.div>

        <div className="w-full px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeIn}
              className={`font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("simpleProcess")}
            </motion.span>
            <motion.h2 
              variants={fadeIn}
              className={`font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("howItWorksTitle")}
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className={`font-sans text-gray-300 max-w-2xl mx-auto ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
            >
              {t("startChattingSteps")}
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div 
              variants={fadeIn}
              className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                <span className="font-display text-2xl font-bold digit">1</span>
              </motion.div>
              <h3 className={`font-display text-xl font-semibold mb-3 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("step1")}</h3>
              <p className={`font-sans text-gray-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("step1Desc")}
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                <span className="font-display text-2xl font-bold digit">2</span>
              </motion.div>
              <h3 className={`font-display text-xl font-semibold mb-3 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("step2")}</h3>
              <p className={`font-sans text-gray-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("step2Desc")}
              </p>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                <span className="font-display text-2xl font-bold digit">3</span>
              </motion.div>
              <h3 className={`font-display text-xl font-semibold mb-3 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>{t("step3")}</h3>
              <p className={`font-sans text-gray-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("step3Desc")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-md p-12 rounded-3xl max-w-4xl mx-auto border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className={`font-display text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
          >
            {t("readyToChat")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className={`font-sans text-gray-300 max-w-2xl mx-auto mb-8 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}
          >
            {t("joinUsers")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <Link href="/explore">
              <Button className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-lg text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("exploreCharacters")}
                <ArrowRight className={`${isKurdish ? 'mr-2' : 'ml-2'} h-5 w-5 icon-rtl-aware`} />
              </Button>
            </Link>
          </motion.div>
          
          {/* Add animated floating particles for visual interest */}
          <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                initial={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: 0
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: Math.random() * 8 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer - completely hidden on mobile screens */}
      <footer className="bg-indigo-950 py-12 mt-auto hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="relative h-12 w-12">
                <Image 
                  src="/images/logo.png" 
                  alt="ChatKurd Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">ChatKurd</span>
            </div>
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                {t("privacy")}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t("terms")}
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                {t("contact")}
              </Link>
            </div>
            <div className="text-gray-400">© 2025 ChatKurd. {t("allRightsReserved")}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}