export type Language = 'en' | 'ku';

export const translations = {
  en: {
    // Navigation
    characters: "Characters",
    features: "Features",
    howItWorks: "How it Works",
    signIn: "Sign In",
    about: "About",
    
    // TabBar
    home: "Home",
    explore: "Explore",
    create: "Create",
    favorites: "Favorites",
    profile: "Profile",
    
    // Profile Page
    accountDetails: "Account Details",
    notifications: "Notifications",
    settings: "Settings",
    appearance: "Appearance",
    logOut: "Log Out",
    premium: "Standard Account",
    profileUpdated: "Profile Updated",
    profilePictureUpdated: "Your profile picture has been updated.",
    profilePictureRemoved: "Your profile picture has been removed.",
    uploadFailed: "Upload Failed",
    failedToUpload: "Failed to upload profile picture.",
    loggedOut: "Logged Out",
    youHaveBeenLoggedOut: "You have been logged out.",
    navigation: "Navigation",
    navigatingTo: "Navigating to",
    placeholder: "placeholder",
    recentActivity: "Recent Activity",
    
    // Dashboard related
    dashboard: "Dashboard",
    goToDashboard: "Go to Dashboard",
    welcomeBack: "Welcome Back",
    discoverCharacters: "Discover new characters to chat with or continue your conversations",
    popularCharacters: "Popular Characters",
    trendingNow: "Trending Now",
    recentConversations: "Recent Conversations",
    noRecentConversations: "No Recent Conversations",
    startChattingToSee: "Start chatting with characters to see your recent conversations here",
    viewAll: "View All",
    
    // Hero section
    chatWith: "Chat with",
    uniqueCharacters: "Unique Characters",
    notJustBot: "Not Just Another Bot",
    experienceConversations: "Experience conversations with personality. Our AI-powered characters bring a new dimension to chatbot interactions.",
    meetOurCharacters: "Meet Our Characters",
    
    // Characters section
    meetTheTeam: "MEET THE TEAM",
    meetCharactersTitle: "Meet Our Characters",
    eachWithPersonality: "Each with their own personality, expertise, and conversation style.",
    startChatting: "Start Chatting",
    instantResponse: "Get instant responses to your messages",
    noSignupRequired: "No signup required, start now",
    
    // Features section
    capabilities: "CAPABILITIES",
    uniqueFeatures: "Unique Features",
    discoverSpecial: "Discover what makes our character-based chatbot experience special.",
    distinctPersonalities: "Distinct Personalities",
    personalitiesDesc: "Each character has their own backstory, expertise, and conversation style for a more engaging experience.",
    contextualMemory: "Contextual Memory",
    memoryDesc: "Characters remember your conversations and build relationships over time.",
    safeInteractions: "Safe Interactions",
    safeDesc: "All characters are designed to provide helpful, appropriate responses in any context.",
    
    // Stats section
    growingCommunity: "GROWING COMMUNITY",
    ourImpact: "Our Global Impact",
    communityDescription: "Join the thousands of users already embracing our conversational AI experience.",
    activeUsers: "Active Users",
    conversations: "Conversations",
    languages: "Languages",
    
    // How it works section
    simpleProcess: "SIMPLE PROCESS",
    howItWorksTitle: "How It Works",
    startChattingSteps: "Start chatting with our characters in three simple steps.",
    step1: "Choose a Character",
    step1Desc: "Select from our diverse cast of AI characters based on your interests or needs.",
    step2: "Start a Conversation",
    step2Desc: "Begin chatting naturally as you would with a friend. No special commands needed.",
    step3: "Build a Relationship",
    step3Desc: "Return to the same character to continue where you left off. They'll remember you.",
    
    // CTA section
    readyToChat: "Ready to Start Chatting?",
    joinUsers: "Join thousands of users already having meaningful conversations with our unique AI characters.",
    exploreCharacters: "Explore Characters",
    
    // Footer
    copyright: "© 2023 Nestro Chat. All rights reserved.",
    
    // Language toggle
    switchLanguage: "کوردی",
    
    // Theme Toggle
    lightModeActivated: "Light mode activated",
    darkModeActivated: "Dark mode activated",
    switchedToLight: "Switched to light theme",
    switchedToDark: "Switched to dark theme",
    
    // Image Uploader
    uploading: "Uploading...",
    clickOrDrop: "Click or drop image",
    
    // Verification
    verification: {
      title: "Email Verification",
      checking: "Checking verification status...",
      verifiedTitle: "Email Verified",
      unverifiedTitle: "Email Not Verified",
      verifiedDescription: "Your email address has been verified",
      unverifiedDescription: "Please verify your email address to unlock all features",
      verifiedMessage: "Your email address has been successfully verified.",
      unverifiedMessage: "We sent a verification link to {email}. Please check your inbox.",
      sendVerification: "Resend Verification Email",
      emailSent: "Verification email sent. Please check your inbox.",
      errorTitle: "Verification Error",
      infoMessage: "Email verification helps secure your account and unlocks additional features.",
      testingNote: "For demo purposes, verification codes will be displayed here instead of being sent by email.",
      enterCode: "Enter Verification Code",
      codeSentTo: "We sent a 4-digit code to {email}",
      resendCode: "Resend Code",
      cancel: "Cancel",
      codeInvalid: "Invalid verification code. Please try again.",
    },
  },
  ku: {
    // Navigation
    characters: "کەسایەتییەکان",
    features: "تایبەتمەندییەکان",
    howItWorks: "چۆن کار دەکات",
    signIn: "چوونەژوورەوە",
    about: "دەربارە",
    
    // TabBar
    home: "سەرەکی",
    explore: "گەڕان",
    create: "دروستکردن",
    favorites: "دڵخوازەکان",
    profile: "پرۆفایل",
    
    // Profile Page
    accountDetails: "جۆری حساب",
    notifications: "نووسینەکان",
    settings: "ڕەندینی",
    appearance: "ڕەندینی",
    logOut: "لێکدان",
    premium: "حسابی ستاندارد",
    profileUpdated: "پرۆفایلی هەڵگرت",
    profilePictureUpdated: "ڕەندینی پرۆفایلی خۆت هەڵگرت.",
    profilePictureRemoved: "ڕەندینی پرۆفایلی خۆت سەردانە.",
    uploadFailed: "سەردانی بەکاربهێنە",
    failedToUpload: "سەردانی بەکاربهێنەی پرۆفایلی خۆت نەبوو.",
    loggedOut: "لێکدان",
    youHaveBeenLoggedOut: "تەواو بوویت لێکدان.",
    navigation: "نەوت",
    navigatingTo: "بەروباردان بە",
    placeholder: "بەروباردان بە",
    
    // Dashboard related
    dashboard: "داشبۆرد",
    goToDashboard: "بڕۆ بۆ داشبۆرد",
    welcomeBack: "بەخێربێیتەوە",
    discoverCharacters: "کەسایەتی نوێ بدۆزەرەوە بۆ گفتوگۆ یان درێژە بە گفتوگۆکانت بدە",
    popularCharacters: "کەسایەتییە بەناوبانگەکان",
    trendingNow: "باوەکانی ئێستا",
    recentConversations: "گفتوگۆ دواییەکان",
    noRecentConversations: "هیچ گفتوگۆیەکی دوایی نییە",
    startChattingToSee: "دەست بکە بە گفتوگۆ لەگەڵ کەسایەتییەکان بۆ ئەوەی گفتوگۆ دواییەکانت لێرە ببینیت",
    viewAll: "هەموویان ببینە",
    
    // Hero section
    chatWith: "گفتوگۆ لەگەڵ",
    uniqueCharacters: "کەسایەتی تایبەت",
    notJustBot: "نەک تەنها ڕۆبۆتێکی تر",
    experienceConversations: "ئەزموونی گفتوگۆ لەگەڵ کەسایەتی. کارەکتەرەکانی ئێمە بە هۆشی دەستکرد، ڕەهەندێکی نوێ دەبەخشن بە گفتوگۆکانی چات بۆت.",
    meetOurCharacters: "کەسایەتییەکانمان بناسە",
    
    // Characters section
    meetTheTeam: "تیمەکەمان بناسە",
    meetCharactersTitle: "کەسایەتییەکانمان بناسە",
    eachWithPersonality: "هەر یەکەیان کەسایەتی، شارەزایی و شێوازی گفتوگۆی تایبەت بە خۆیان هەیە.",
    startChatting: "دەست بکە بە گفتوگۆ",
    instantResponse: "وەڵامی دەستبەجێ بۆ پەیامەکانت وەرگرە",
    noSignupRequired: "پێویست بە ناونووسین ناکات، ئێستا دەستپێبکە",
    
    // Features section
    capabilities: "تواناکان",
    uniqueFeatures: "تایبەتمەندییە تایبەتەکان",
    discoverSpecial: "ئەو شتانە بدۆزەرەوە کە ئەزموونی چات بۆتی کەسایەتی-بنەما تایبەت دەکەن.",
    distinctPersonalities: "کەسایەتی جیاواز",
    personalitiesDesc: "هەر کارەکتەرێک چیرۆکی پشت پەردە، شارەزایی و شێوازی گفتوگۆی تایبەت بە خۆی هەیە بۆ ئەزموونێکی زیاتر کاریگەر.",
    contextualMemory: "بیرەوەری کۆنتێکست",
    memoryDesc: "کارەکتەرەکان گفتوگۆکانت لەبیر دەمێنێت و پەیوەندییەکان بە درێژایی کات دروست دەکەن.",
    safeInteractions: "کارلێکی پارێزراو",
    safeDesc: "هەموو کارەکتەرەکان بۆ ئەوە دیزاین کراون کە وەڵامی یارمەتیدەر و گونجاو لە هەر بارودۆخێکدا پێشکەش بکەن.",
    
    // Stats section
    growingCommunity: "بەناوبانگی بەرز",
    ourImpact: "ڕەزایی بەرزی ئەمری",
    communityDescription: "بەشداری هەزاران بەکارهێنەر بکە کە پێشتر گفتوگۆی بە واتا لەگەڵ کارەکتەرە تایبەتەکانی ئێمە دەکەن.",
    activeUsers: "بەکارهێنەر بەرز",
    conversations: "گفتوگۆ",
    languages: "زمان",
    
    // How it works section
    simpleProcess: "پرۆسەیەکی سادە",
    howItWorksTitle: "چۆن کار دەکات",
    startChattingSteps: "بە سێ هەنگاوی سادە دەست بکە بە گفتوگۆ لەگەڵ کەسایەتییەکانمان.",
    step1: "کەسایەتییەک هەڵبژێرە",
    step1Desc: "لە نێو کۆمەڵێک کارەکتەری جیاوازی هۆشی دەستکردی ئێمە، هەڵبژێرە لەسەر بنەمای بەرژەوەندی یان پێویستییەکانت.",
    step2: "دەست بکە بە گفتوگۆ",
    step2Desc: "بە سروشتی دەست بکە بە قسەکردن وەک هاوڕێ. پێویستت بە فەرمانی تایبەت نییە.",
    step3: "پەیوەندی دروست بکە",
    step3Desc: "بگەڕێوە بۆ هەمان کەسایەتی بۆ درێژەپێدانی گفتوگۆ لەوێ ڕاوەستا. ئەوان تۆ لەبیر دەمێنێت.",
    
    // CTA section
    readyToChat: "ئامادەیت دەست بکەیت بە گفتوگۆ؟",
    joinUsers: "بەشداری هەزاران بەکارهێنەر بکە کە پێشتر گفتوگۆی بە واتا لەگەڵ کارەکتەرە تایبەتەکانی ئێمە دەکەن.",
    exploreCharacters: "کەشف کردنی کەسایەتییەکان",
    
    // Footer
    copyright: "© ٢٠٢٣ نێسترۆ چات. هەموو مافەکان پارێزراون.",
    
    // Language toggle
    switchLanguage: "English",
    
    // Theme Toggle
    lightModeActivated: "ڕۆشنایی چالاک بوو",
    darkModeActivated: "شێوازی تاریک چالاک کرا",
    switchedToLight: "گۆڕدرا بۆ ڕۆشنایی",
    switchedToDark: "گۆڕدرا بۆ تاریک",
    
    // Image Uploader
    uploading: "بارکردن...",
    clickOrDrop: "کلیک بکە یان وێنەکە دابنێ",
    
    // Verification
    verification: {
      title: "پشتڕاستکردنەوەی ئیمەیل",
      checking: "پشکنینی دۆخی پشتڕاستکردنەوە...",
      verifiedTitle: "ئیمەیل پشتڕاست کراوەتەوە",
      unverifiedTitle: "ئیمەیل پشتڕاست نەکراوەتەوە",
      verifiedDescription: "ناونیشانی ئیمەیڵەکەت پشتڕاست کراوەتەوە",
      unverifiedDescription: "تکایە ناونیشانی ئیمەیڵەکەت پشتڕاست بکەوە بۆ کردنەوەی هەموو تایبەتمەندییەکان",
      verifiedMessage: "ناونیشانی ئیمەیڵەکەت بە سەرکەوتوویی پشتڕاست کراوەتەوە.",
      unverifiedMessage: "لینکی پشتڕاستکردنەوەمان ناردووە بۆ {email}. تکایە سندوقی پۆستەکەت بپشکنە.",
      sendVerification: "دووبارە ناردنی ئیمەیلی پشتڕاستکردنەوە",
      emailSent: "ئیمەیلی پشتڕاستکردنەوە نێردرا. تکایە سندوقی پۆستەکەت بپشکنە.",
      errorTitle: "هەڵەی پشتڕاستکردنەوە",
      infoMessage: "پشتڕاستکردنەوەی ئیمەیل یارمەتی پاراستنی هەژمارەکەت دەدات و تایبەتمەندییەکانی زیاتر دەکاتەوە.",
      testingNote: "بۆ مەبەستی پیشاندان، کۆدەکانی پشتڕاستکردنەوە لێرە پیشان دەدرێن لە جیاتی ئەوەی بە ئیمەیل بنێردرێن.",
      enterCode: "کۆدی پشتڕاستکردنەوە بنووسە",
      codeSentTo: "کۆدێکی ٤ ژمارەییمان ناردووە بۆ {email}",
      resendCode: "دووبارە ناردنی کۆد",
      cancel: "پاشگەزبوونەوە",
      codeInvalid: "کۆدی پشتڕاستکردنەوە نادروستە. تکایە دووبارە هەوڵ بدەوە.",
    },
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key as keyof typeof translations[typeof lang]] || translations.en[key];
} 