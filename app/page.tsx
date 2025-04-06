"use client";

import Link from "next/link"
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles, LogIn, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { useLanguage } from "./i18n/LanguageContext"
import LanguageToggle from "@/components/language-toggle"

// Dynamically import components with client-side rendering
const CharacterEyes = dynamic(() => import("@/components/landing/character-eyes"), { ssr: false })
const SimplifiedBackground = dynamic(() => import("@/components/landing/simplified-background"), { ssr: false })
const FeatureCard = dynamic(() => import("@/components/landing/feature-card"), { ssr: false })
const CharacterShowcase = dynamic(() => import("@/components/landing/character-showcase"), { ssr: false })
const ModernNavbar = dynamic(() => import("@/components/landing/modern-navbar"), { ssr: false })

export default function Home() {
  const { t, language } = useLanguage();
  const isKurdish = language === "ku";

  return (
    <div className={`fixed inset-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
      {/* Modern Navbar */}
      <ModernNavbar />

      {/* Hero Section with Simplified Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Simplified Background */}
        <SimplifiedBackground />

        {/* Add a subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-transparent to-indigo-950/70 z-[1]"></div>

        <div className="w-full px-4 py-20 relative z-10 text-center">
          <div className="bg-indigo-900/20 backdrop-blur-md p-8 md:p-12 rounded-3xl max-w-4xl mx-auto border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div className="relative h-24 md:h-32 mb-4">
              <CharacterEyes />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {t("chatWith")} <span className="text-purple-400">{t("uniqueCharacters")}</span>, {t("notJustBot")}
            </h1>
            <p className="font-sans text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {t("experienceConversations")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 rounded-lg text-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:-translate-y-1">
                  {t("meetOurCharacters")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-colors px-6 py-6 rounded-lg text-lg">
                  <HomeIcon className="mr-2 h-5 w-5" />
                  {t("dashboard")}
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Character Showcase Section */}
      <section id="characters" className="w-full px-4 py-20 relative scroll-mt-20">
        {/* Add decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative z-10">
          <span className="font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
            {t("meetTheTeam")}
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight">
            {t("meetCharactersTitle")}
          </h2>
          <p className="font-sans text-gray-300 max-w-2xl mx-auto">
            {t("eachWithPersonality")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <CharacterShowcase />
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 overflow-hidden scroll-mt-20">
        {/* Add background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950/50 to-indigo-950"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-indigo-950 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-indigo-950 to-transparent"></div>

        {/* Add floating shapes */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="w-full px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
              {t("capabilities")}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight">
              {t("uniqueFeatures")}
            </h2>
            <p className="font-sans text-gray-300 max-w-2xl mx-auto">
              {t("discoverSpecial")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-purple-400" />}
              title={t("distinctPersonalities")}
              description={t("personalitiesDesc")}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-purple-400" />}
              title={t("contextualMemory")}
              description={t("memoryDesc")}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-purple-400" />}
              title={t("safeInteractions")}
              description={t("safeDesc")}
            />
          </div>
          </div>
        </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-indigo-900/50 backdrop-blur-lg"></div>

        {/* Add animated gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 animate-gradient-slow"></div>
        </div>

        <div className="w-full px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="font-sans inline-block px-4 py-1 bg-purple-900/50 rounded-full text-purple-300 text-sm font-medium mb-4">
              {t("simpleProcess")}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight">
              {t("howItWorksTitle")}
            </h2>
            <p className="font-sans text-gray-300 max-w-2xl mx-auto">{t("startChattingSteps")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="font-display text-2xl font-bold">1</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{t("step1")}</h3>
              <p className="font-sans text-gray-300">
                {t("step1Desc")}
              </p>
            </div>

            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="font-display text-2xl font-bold">2</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{t("step2")}</h3>
              <p className="font-sans text-gray-300">
                {t("step2Desc")}
              </p>
            </div>

            <div className="bg-indigo-800/40 backdrop-blur-sm p-8 rounded-xl text-center border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <span className="font-display text-2xl font-bold">3</span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{t("step3")}</h3>
              <p className="font-sans text-gray-300">
                {t("step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-md p-12 rounded-3xl max-w-4xl mx-auto border border-purple-500/20 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight">
            {t("readyToChat")}
          </h2>
          <p className="font-sans text-gray-300 max-w-2xl mx-auto mb-8">
            {t("joinUsers")}
          </p>
          <Link href="/explore">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 rounded-lg text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1">
              {t("exploreCharacters")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-indigo-950 border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            <span className="font-display font-bold text-lg">CharacterChat</span>
          </div>
          <p className="font-sans text-sm text-gray-400">{t("copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
