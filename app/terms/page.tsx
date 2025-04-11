"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

export default function TermsPage() {
  const router = useRouter();
  const { language, isKurdish } = useLanguage();

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
          {isKurdish ? "مەرجەکانی خزمەتگوزاری" : "Terms of Service"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden mb-6">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <FileText className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "مەرجەکانی خزمەتگوزاری" : "Terms of Service"}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <div className={`space-y-4 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "١. ڕەزامەندی" : "1. Acceptance"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "بە بەکارهێنانی ئەپڵیکەیشنی ChatKurd، تۆ ڕەزامەندی دەردەبڕیت بۆ ئەم مەرجانەی خزمەتگوزاری. ئەگەر ڕازی نیت بەم مەرجانە، تکایە بەکارهێنانی ئەم ئەپڵیکەیشنە ڕابگرە."
                  : "By using the ChatKurd application, you agree to these Terms of Service. If you do not agree to these terms, please discontinue use of this application."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٢. بەکارهێنانی خزمەتگوزارییەکان" : "2. Use of Services"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "تۆ ڕەزامەندی دەدەیت بەکارهێنانی خزمەتگوزارییەکانمان تەنها بۆ مەبەستی یاسایی و بەپێی هەموو یاسا و ڕێساکانی کارپێکراو. تۆ بەڵێن دەدەیت بەشێوەیەک بەکارهێنانی خزمەتگوزارییەکەمان نەکەیت کە لەوانەیە زیان بە خزمەتگوزارییەکان یان بەکارهێنەرانی دیکە بگەیەنێت."
                  : "You agree to use our services only for lawful purposes and in accordance with all applicable laws and regulations. You agree not to use our service in a way that may harm the services or other users."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٣. هەژماری بەکارهێنەر" : "3. User Account"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "تۆ بەرپرسیاریت لە پاراستنی زانیاری چوونەژوورەوەی هەژمارەکەت و بۆ هەموو چالاکییەک کە ڕوودەدات لەژێر هەژمارەکەتدا. تۆ دەبێت دەستبەجێ ئاگادارمان بکەیتەوە ئەگەر هەر جۆرە بەکارهێنانێکی نەناسراو یان گومانلێکراو هەیە لە هەژمارەکەتدا."
                  : "You are responsible for safeguarding your account login information and for all activity that occurs under your account. You must notify us immediately of any unauthorized or suspicious use of your account."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٤. مافی چاپ و بڵاوکردنەوە" : "4. Intellectual Property"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "هەموو ناوەڕۆک و توانا و زانیاری لە ئەپڵیکەیشنەکەدا موڵکی ChatKurd یان مۆڵەتپێدراوانیەتی و پارێزراوە بەپێی یاساکانی مافی چاپ و بڵاوکردنەوە، بەبێ سنووردارکردن، مافی چاپ، نیشانە بازرگانییەکان، و مافەکانی دیکەی خاوەندارێتی."
                  : "All content, features, and information on the application are the property of ChatKurd or its licensors and are protected under copyright, trademark, and other intellectual property laws."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٥. سنووردارکردنی بەرپرسیارێتی" : "5. Limitation of Liability"}
              </h2>
              <p className="text-sm text-purple-200">
                {isKurdish 
                  ? "تا ئەو ڕادەیەی کە ڕێگەپێدراوە بەپێی یاسای کارپێکراو، ChatKurd و بەڕێوەبەرەکانی، ئەندامەکانی، کارمەندان، یان نوێنەرەکانی بەرپرسیار نابن بۆ هیچ زیانێکی ڕاستەوخۆ، ناڕاستەوخۆ، ڕێکەوت، تایبەت یان ئاکاری کە دەرەنجامی بەکارهێنان یان ناتوانای بەکارهێنانی خزمەتگوزارییەکانمان بێت."
                  : "To the extent permitted by applicable law, ChatKurd and its directors, members, employees, or agents shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services."}
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-purple-300">
                {isKurdish ? "دوایین نوێکردنەوە: ١٠ مارس ٢٠٢٤" : "Last updated: March 10, 2024"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-900/50 backdrop-blur-md p-4 rounded-2xl border border-purple-500/20">
          <p className={`text-sm text-purple-200 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
            {isKurdish 
              ? "بە بەکارهێنانی ئەپڵیکەیشنی ChatKurd، تۆ ڕەزامەندی دەردەبڕیت بۆ پابەندبوون بەم مەرجانەی خزمەتگوزاری. تکایە بە وردی بیانخوێنەوە."
              : "By using the ChatKurd application, you agree to be bound by these Terms of Service. Please read them carefully."}
          </p>
        </div>
      </div>
    </div>
  );
} 