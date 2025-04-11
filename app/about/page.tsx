"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, InfoIcon, Globe, Code, Github, Twitter, ExternalLink } from "lucide-react"
import { useLanguage } from "@/app/i18n/LanguageContext"
import Image from "next/image"

export default function AboutPage() {
  const router = useRouter()
  const { language, isKurdish } = useLanguage()

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full text-white hover:bg-white/10 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "دەربارە" : "About"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6 mb-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image 
                src="/logo.png"
                alt="ChatKurd Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* App name and version */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">ChatKurd</h2>
            <p className="text-purple-300 text-sm">{isKurdish ? "وەشانی ١.٠.٠" : "Version 1.0.0"}</p>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish ? "چاتکورد چییە؟" : "What is ChatKurd?"}
            </h3>
            <p className={`text-sm text-purple-200 leading-relaxed mb-4 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish 
                ? "چاتکورد یەکەم زیرەکی دەستکردە بە زمانی کوردی کە بەکاردێت بۆ وەڵامدانەوەی پرسیارەکانت، یارمەتیدانت لە کارەکانت، و کۆمەڵێک کاری تر. هەروەها بە زمانی ئینگلیزیش بەردەستە."
                : "ChatKurd is the first AI assistant in Kurdish language that can answer your questions, help with tasks, and much more. It's also available in English."}
            </p>
            <p className={`text-sm text-purple-200 leading-relaxed ${isKurdish ? "text-right" : ""}`}>
              {isKurdish 
                ? "ئامانجی سەرەکیمان دروستکردنی پەیوەندییەکی باشترە لە نێوان کەسانی کوردیزمان و تەکنەلۆجیای زیرەکی دەستکرد، و بەرەوپێشبردنی بەکارهێنانی زمانی کوردی لە بواری تەکنەلۆجیادا."
                : "Our main goal is to bridge the gap between Kurdish speakers and AI technology, and to promote the use of Kurdish language in the tech industry."}
            </p>
          </div>
          
          {/* Features */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish ? "تایبەتمەندییەکان" : "Features"}
            </h3>
            <ul className={`text-sm text-purple-200 space-y-2 ${isKurdish ? "text-right list-inside" : "list-disc list-inside"}`}>
              <li>{isKurdish ? "وتووێژ بە زمانی کوردی و ئینگلیزی" : "Conversations in Kurdish and English"}</li>
              <li>{isKurdish ? "کەسایەتییە ئەلێکترۆنییە جیاوازەکان" : "Different AI characters"}</li>
              <li>{isKurdish ? "پاراستنی مێژووی وتووێژەکان" : "Conversation history"}</li>
              <li>{isKurdish ? "دلخوازکردنی ڕووکاری بەرنامە" : "Customizable themes"}</li>
              <li>{isKurdish ? "وەڵامدانەوەی خێرا و وردی پرسیارەکان" : "Fast and accurate responses"}</li>
            </ul>
          </div>
          
          {/* Created by */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish ? "لەلایەن کێوە دروستکراوە؟" : "Created By"}
            </h3>
            <p className={`text-sm text-purple-200 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish 
                ? "چاتکورد لەلایەن تیمێکی گەنجی کورد دروستکراوە کە خولیای تەکنەلۆجیا و زمانی کوردین."
                : "ChatKurd was created by a team of Kurdish developers passionate about technology and the Kurdish language."}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${isKurdish ? "text-right" : ""}`}>
              {isKurdish ? "پەیوەندی" : "Connect"}
            </h3>
            <div className={`flex ${isKurdish ? "justify-end" : "justify-start"} space-x-4 text-purple-200`}>
              <a href="https://github.com/your-org/chatkurd" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                <Github className="h-5 w-5 mr-1" />
                <span className="text-sm">GitHub</span>
              </a>
              <a href="https://twitter.com/chatkurd" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                <Twitter className="h-5 w-5 mr-1" />
                <span className="text-sm">Twitter</span>
              </a>
              <a href="https://chatkurd.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white">
                <ExternalLink className="h-5 w-5 mr-1" />
                <span className="text-sm">Website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 