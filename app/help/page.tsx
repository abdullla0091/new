"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

// FAQ Item component
const FAQItem = ({ question, answer, isOpen, toggle, isKurdish }: { 
  question: string; 
  answer: string;
  isOpen: boolean;
  toggle: () => void;
  isKurdish: boolean;
}) => {
  return (
    <div className="border-b border-purple-500/20 last:border-0">
      <button 
        onClick={toggle}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-indigo-800/30 transition-colors ${isKurdish ? 'flex-row-reverse' : ''}`}
      >
        <span className={`text-base font-medium ${isKurdish ? 'kurdish use-local-kurdish text-right' : ''}`}>
          {question}
        </span>
        {isOpen ? 
          <ChevronUp className="h-5 w-5 text-purple-300" /> : 
          <ChevronDown className="h-5 w-5 text-purple-300" />
        }
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          <p className={`text-sm text-purple-200 ${isKurdish ? 'kurdish use-local-kurdish text-right' : ''}`}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default function HelpPage() {
  const router = useRouter();
  const { language, isKurdish } = useLanguage();
  
  // State to track which FAQ is open
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
  // Toggle FAQ open/close
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  // FAQ data with both languages
  const faqs = [
    {
      questionEn: "What is ChatKurd?",
      questionKu: "ChatKurd چییە؟",
      answerEn: "ChatKurd is an AI chat platform specifically designed for Kurdish speakers, with full support for the Kurdish language. It allows you to have natural conversations with AI assistants in both Kurdish and English.",
      answerKu: "ChatKurd پلاتفۆرمێکی گفتوگۆی هۆشی دەستکردە کە بەتایبەت بۆ ئاخێوەرانی کوردی دیزاین کراوە، بە پشتگیری تەواوی زمانی کوردی. ڕێگەت پێدەدات گفتوگۆی سروشتی لەگەڵ یاریدەدەرانی هۆشی دەستکرد بکەیت بە هەردوو زمانی کوردی و ئینگلیزی."
    },
    {
      questionEn: "How do I change the language?",
      questionKu: "چۆن زمان بگۆڕم؟",
      answerEn: "To change the language, go to the settings menu by tapping your profile picture at the bottom of the home screen. Then select 'Language' and choose your preferred language from the available options.",
      answerKu: "بۆ گۆڕینی زمان، بڕۆ بۆ مێنیوی ڕێکخستنەکان بە کرتەکردن لەسەر وێنەی پرۆفایلەکەت لە خوارەوەی شاشەی سەرەکی. پاشان 'زمان' هەڵبژێرە و زمانی دڵخوازت لە بژاردەکان هەڵبژێرە."
    },
    {
      questionEn: "Can I create my own AI character?",
      questionKu: "دەتوانم کارەکتەری هۆشی دەستکردی تایبەت بە خۆم دروست بکەم؟",
      answerEn: "Yes! Go to the 'Custom Characters' section from the home screen. There, you can create your own AI character by setting a name, personality, and other attributes. Your custom characters will appear alongside the pre-made ones.",
      answerKu: "بەڵێ! بڕۆ بۆ بەشی 'کارەکتەری تایبەت' لە شاشەی سەرەکییەوە. لەوێ، دەتوانیت کارەکتەری هۆشی دەستکردی تایبەت بە خۆت دروست بکەیت بە دیاریکردنی ناو، کەسایەتی، و تایبەتمەندییەکانی تر. کارەکتەرە تایبەتەکانت لە پاڵ ئەوانەی پێشتر دروستکراون دەردەکەون."
    },
    {
      questionEn: "Is my conversation data private?",
      questionKu: "ئایا داتای گفتوگۆکانم تایبەتن؟",
      answerEn: "Yes, we take your privacy seriously. Your conversations are stored securely and not shared with third parties. You can delete your conversation history at any time from the chat settings.",
      answerKu: "بەڵێ، ئێمە تایبەتمەندیەکانت بە جددی وەردەگرین. گفتوگۆکانت بە شێوەیەکی پارێزراو هەڵدەگیرێن و لەگەڵ لایەنی سێیەم هاوبەش ناکرێن. دەتوانیت مێژووی گفتوگۆکانت لە هەر کاتێکدا لە ڕێکخستنەکانی چاتەوە بسڕیتەوە."
    },
    {
      questionEn: "How can I save a favorite conversation?",
      questionKu: "چۆن دەتوانم گفتوگۆیەکی دڵخوازم هەڵبگرم؟",
      answerEn: "During a chat, tap the star icon in the top right of the screen to save that conversation to your favorites. You can access all your favorite conversations from the 'Favorites' tab on the home screen.",
      answerKu: "لە کاتی چاتکردندا، کرتە لە ئایکۆنی ئەستێرە لە لای سەرەوەی ڕاستی شاشەکە بکە بۆ هەڵگرتنی ئەو گفتوگۆیە لە دڵخوازەکانت. دەتوانیت دەستت بە هەموو گفتوگۆ دڵخوازەکانت ڕابگەیت لە تابی 'دڵخوازەکان' لە شاشەی سەرەکیدا."
    },
    {
      questionEn: "Why can't I see my message history?",
      questionKu: "بۆچی ناتوانم مێژووی نامەکانم ببینم؟",
      answerEn: "Message history is stored locally on your device. If you've cleared your browser data or are using a different device, you won't see your previous conversations. We're working on cloud syncing for a future update.",
      answerKu: "مێژووی نامەکان بە شێوەیەکی لۆکاڵی لەسەر ئامێرەکەت هەڵدەگیرێت. ئەگەر داتای وێبگەڕەکەت پاککردبێتەوە یان ئامێرێکی جیاواز بەکاردەهێنیت، گفتوگۆ پێشووەکانت نابینیت. ئێمە کار لەسەر هاوکاتکردنی هەور دەکەین بۆ نوێکردنەوەیەکی داهاتوو."
    }
  ];
  
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
          {isKurdish ? "یارمەتی" : "Help & FAQ"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden mb-6">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <HelpCircle className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "پرسیارە باوەکان" : "Frequently Asked Questions"}
              </p>
            </div>
          </div>
          
          <div>
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={isKurdish ? faq.questionKu : faq.questionEn}
                answer={isKurdish ? faq.answerKu : faq.answerEn}
                isOpen={openFAQ === index}
                toggle={() => toggleFAQ(index)}
                isKurdish={isKurdish}
              />
            ))}
          </div>
        </div>
        
        {/* Additional Help */}
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <HelpCircle className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "یارمەتی زیاتر" : "Additional Help"}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <p className={`text-sm text-purple-200 mb-4 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
              {isKurdish 
                ? "ئەگەر وەڵامی پرسیارەکەت لێرە نەدۆزییەوە، تکایە پەیوەندیمان پێوە بکە بۆ یارمەتی زیاتر."
                : "If you couldn't find the answer to your question here, please contact us for further assistance."}
            </p>
            
            <Button 
              onClick={() => router.push('/contact')}
              className="w-full bg-indigo-800/50 hover:bg-indigo-700/50 text-white border border-purple-500/30 rounded-lg p-3"
            >
              {isKurdish ? "پەیوەندیمان پێوە بکە" : "Contact Support"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 