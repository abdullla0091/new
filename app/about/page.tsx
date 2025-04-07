"use client"

import React from 'react';
import { useLanguage } from "@/app/i18n/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Mail, ExternalLink, Github, Linkedin } from "lucide-react";
import Image from 'next/image';

export default function AboutPage() {
  const { language } = useLanguage();
  const isKurdish = language === 'ku';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-24 md:py-32">
        <div className="bg-indigo-900/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-purple-500/20">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30 mix-blend-overlay">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Profile avatar that overlaps the banner */}
            <div className="absolute -bottom-16 left-6 md:left-10">
              <div className="p-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 ring-2 ring-indigo-900 bg-indigo-800">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-700 to-purple-700">AA</AvatarFallback>
                  {/* If you have an avatar image, uncomment this line */}
                  {/* <AvatarImage src="/path/to/avatar.jpg" alt="Abdulla Aziz" /> */}
                </Avatar>
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div className="pt-20 px-6 pb-8 md:px-10 md:pb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold text-white ${isKurdish ? 'kurdish' : ''}`}>
                  {isKurdish ? 'عەبدوڵڵا عەزیز' : 'Abdulla Aziz'}
                </h1>
                <div className="flex items-center mt-2">
                  <Briefcase className="h-4 w-4 text-purple-300 mr-2" />
                  <p className={`text-sm md:text-base text-purple-200 ${isKurdish ? 'kurdish' : ''}`}>
                    {isKurdish ? 'بەڕێوەبەری جێبەجێکاری کۆدنێست' : 'CEO of CodeNest'}
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <Mail className="h-4 w-4 text-purple-300 mr-2" />
                  <a 
                    href="mailto:Abdullaazizb58@gmail.com" 
                    className="text-sm md:text-base text-purple-200 hover:text-white transition-colors"
                  >
                    Abdullaazizb58@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Social links */}
              <div className="flex mt-4 md:mt-0 space-x-3">
                <a 
                  href="#" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-800/50 hover:bg-indigo-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-purple-200" />
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-800/50 hover:bg-indigo-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-purple-200" />
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-800/50 hover:bg-indigo-700 transition-colors"
                  aria-label="Website"
                >
                  <ExternalLink className="h-5 w-5 text-purple-200" />
                </a>
              </div>
            </div>

            {/* About section */}
            <div className="mb-8">
              <h2 className={`text-xl font-semibold text-white mb-4 ${isKurdish ? 'kurdish' : ''}`}>
                {isKurdish ? 'دەربارە' : 'About'}
              </h2>
              <div className={`text-purple-100 space-y-4 ${isKurdish ? 'kurdish text-right' : ''}`}>
                <p>
                  {isKurdish 
                    ? 'وەک بەڕێوەبەری جێبەجێکاری کۆدنێست، من ڕێبەری تیمێکی پڕ لەهرە و داهێنەر دەکەم کە بە تەواوی خۆیان تەرخان دەکەن بۆ گۆڕینی چۆنیەتی پەیوەندیکردنی کارەکتەرەکانی زیرەکی دەستکرد لەگەڵ بەکارهێنەرەکان، بە تایبەتی لە زمانی کوردیدا.'
                    : 'As the CEO of CodeNest, I lead a team of talented and innovative developers dedicated to transforming how AI characters interact with users, particularly in the Kurdish language.'
                  }
                </p>
                <p>
                  {isKurdish 
                    ? 'لە ڕێگەی پلاتفۆرمەکەمان، ئێمە سنوورەکانی تەکنەلۆجیای زیرەکی دەستکرد دەبەزێنین بۆ دروستکردنی ئەزموونێکی بەتەواوی لۆکاڵایز کراو و بەزیندووکراو بۆ دانیشتوانێک کە زۆر جار پشتگوێ خراون. سەرەتای بەکارهێنانم بۆ تەکنەلۆجیا وەک بەکارهێنەر بوو، بە پاشان گەشەم کرد بۆ بوون بە گەشەپێدەرێک و دواتر خاوەن بیرۆکە.'
                    : 'Through our platform, we push the boundaries of AI technology to create fully localized and personalized experiences for populations often overlooked. My journey with technology began as a user, evolved into a developer, and ultimately a visionary.'
                  }
                </p>
                <p>
                  {isKurdish 
                    ? 'من باوەڕم وایە کە تەکنەلۆجیا دەبێت هەمەگیر بێت و هەموو زمانەکان و کەلتوورەکان لەخۆبگرێت. لەگەڵ چاتکوردا، ئێمە تەنها دەستمان پێنەکردووە بە لادانی بەربەستە زمانەوانییەکان، بەڵکو پەیوەندییە مرۆییەکانیش بونیاد دەنێین - بەهۆی هەر گفتوگۆیەک، هەر وەڵامێک، یەک جار لە یەک کات.'
                    : 'I believe technology should be inclusive and embrace all languages and cultures. With ChatKurd, we\'re not just breaking down language barriers—we\'re building human connections—one conversation, one response at a time.'
                  }
                </p>
              </div>
            </div>

            {/* Skills/expertise section */}
            <div>
              <h2 className={`text-xl font-semibold text-white mb-4 ${isKurdish ? 'kurdish' : ''}`}>
                {isKurdish ? 'شارەزایی' : 'Expertise'}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">AI Integration</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">Next.js</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">React</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">TypeScript</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">Kurdish Localization</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">Product Strategy</Badge>
                <Badge className="bg-indigo-700/60 hover:bg-indigo-700 text-purple-100">Team Leadership</Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 