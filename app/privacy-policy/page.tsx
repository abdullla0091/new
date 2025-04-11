"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";

export default function PrivacyPolicyPage() {
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
          {isKurdish ? "سیاسەتی تایبەتمەندی" : "Privacy Policy"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden mb-6">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "سیاسەتی تایبەتمەندی" : "Privacy Policy"}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <div className={`space-y-4 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "١. کۆکردنەوەی زانیاری" : "1. Information Collection"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "ئێمە هەندێک زانیاری کەسی کۆدەکەینەوە کاتێک ئەپڵیکەیشنەکەمان بەکاردەهێنیت، وەک ناوی بەکارهێنەر، ئیمەیڵ، و زانیاری گفتوگۆکان. ئەم زانیاریانە بەکارهێنراون بۆ پێشکەشکردنی خزمەتگوزارییەکانمان و باشترکردنی ئەزموونی بەکارهێنەر."
                  : "We collect certain personal information when you use our application, such as username, email, and conversation data. This information is used to provide our services and improve user experience."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٢. بەکارهێنانی زانیاری" : "2. Information Usage"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "زانیارییەکانی کۆکراوە بەکاردەهێنرێن بۆ:\n- پێشکەشکردنی خزمەتگوزارییەکانمان\n- باشترکردنی ئەپڵیکەیشنەکەمان\n- پەیوەندیکردن لەگەڵ بەکارهێنەران\n- هەڵسەنگاندنی خزمەتگوزارییەکانمان"
                  : "Collected information is used for:\n- Providing our services\n- Improving our application\n- Communication with users\n- Service evaluation"}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٣. پاراستنی زانیاری" : "3. Information Protection"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "ئێمە ڕێوشوێنی ئاسایشی گونجاو دەگرینەبەر بۆ پاراستنی زانیاریەکانت. ئێمە زانیاریەکانت ناگوازینەوە بۆ لایەنی سێیەم بەبێ ڕەزامەندیت، تەنها لەو کاتانەدا نەبێت کە یاسا داوامان لێدەکات."
                  : "We implement appropriate security measures to protect your information. We do not transfer your information to third parties without your consent, except when required by law."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٤. کووکیز و تەکنەلۆژیای تەقیبکردن" : "4. Cookies and Tracking Technologies"}
              </h2>
              <p className="text-sm text-purple-200 mb-3">
                {isKurdish 
                  ? "ئەپڵیکەیشنەکەمان لەوانەیە کووکیز و تەکنەلۆژیای تەقیبکردنی هاوشێوە بەکاربهێنێت بۆ باشترکردنی ئەزموونی بەکارهێنەر و کۆکردنەوەی داتای شیکاری."
                  : "Our application may use cookies and similar tracking technologies to improve user experience and collect analytics data."}
              </p>
              
              <h2 className="text-lg font-semibold mb-2">
                {isKurdish ? "٥. گۆڕانکارییەکان لە سیاسەتی تایبەتمەندیدا" : "5. Changes to Privacy Policy"}
              </h2>
              <p className="text-sm text-purple-200">
                {isKurdish 
                  ? "ئێمە لەوانەیە سیاسەتی تایبەتمەندیمان بگۆڕین لە هەر کاتێکدا. ئێمە هەموو گۆڕانکارییە گرنگەکان ڕادەگەیەنین لە ڕێگەی پۆستی ئەلیکترۆنی یان ئاگادارکردنەوە لە ئەپڵیکەیشنەکەدا."
                  : "We may change our privacy policy at any time. We will announce all significant changes via email or in-app notifications."}
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
              ? "بۆ پرسیار یان نیگەرانییەکان سەبارەت بە سیاسەتی تایبەتمەندیمان، تکایە پەیوەندی بکە بە support@chatkurd.com"
              : "For questions or concerns about our privacy policy, please contact support@chatkurd.com"}
          </p>
        </div>
      </div>
    </div>
  );
} 