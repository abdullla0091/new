"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Mail, MessageSquare, User } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const router = useRouter();
  const { language, isKurdish } = useLanguage();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      
      // Show success toast
      toast({
        title: isKurdish ? "پەیامەکەت نێردرا" : "Message Sent",
        description: isKurdish 
          ? "سوپاس بۆ پەیوەندی کردن. لە زووترین کاتدا وەڵامت دەدەینەوە."
          : "Thank you for reaching out. We'll respond as soon as possible.",
        duration: 3000,
      });
    }, 1500);
  };

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
          {isKurdish ? "پەیوەندی" : "Contact Us"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden mb-6">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <MessageSquare className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "فۆرمی پەیوەندی" : "Contact Form"}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <p className={`text-sm text-purple-200 mb-6 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
              {isKurdish 
                ? "پرسیار، پێشنیار، یان کێشەیەکت هەیە؟ فۆرمەکە پڕبکەرەوە و ئێمە لە زووترین کاتدا پەیوەندیت پێوە دەکەین."
                : "Have a question, suggestion, or issue? Fill out the form and we'll get back to you as soon as possible."}
            </p>
            
            <form onSubmit={handleSubmit} className={`space-y-4 ${isKurdish ? 'text-right' : ''}`}>
              {/* Name Input */}
              <div>
                <div className={`flex items-center mb-2 ${isKurdish ? 'flex-row-reverse' : ''}`}>
                  <User className={`h-4 w-4 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                  <label className="text-sm text-purple-200">
                    {isKurdish ? "ناو" : "Name"}
                  </label>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`w-full bg-indigo-800/30 border border-purple-500/30 rounded-lg p-3 text-white placeholder-purple-300/50 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}
                  placeholder={isKurdish ? "ناوی تەواوت بنووسە" : "Enter your full name"}
                />
              </div>
              
              {/* Email Input */}
              <div>
                <div className={`flex items-center mb-2 ${isKurdish ? 'flex-row-reverse' : ''}`}>
                  <Mail className={`h-4 w-4 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                  <label className="text-sm text-purple-200">
                    {isKurdish ? "ئیمەیڵ" : "Email"}
                  </label>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full bg-indigo-800/30 border border-purple-500/30 rounded-lg p-3 text-white placeholder-purple-300/50 ${isKurdish ? 'text-right' : ''}`}
                  placeholder={isKurdish ? "ئیمەیڵەکەت بنووسە" : "Enter your email address"}
                />
              </div>
              
              {/* Message Input */}
              <div>
                <div className={`flex items-center mb-2 ${isKurdish ? 'flex-row-reverse' : ''}`}>
                  <MessageSquare className={`h-4 w-4 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                  <label className="text-sm text-purple-200">
                    {isKurdish ? "پەیام" : "Message"}
                  </label>
                </div>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className={`w-full bg-indigo-800/30 border border-purple-500/30 rounded-lg p-3 text-white placeholder-purple-300/50 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}
                  placeholder={isKurdish ? "پەیامەکەت بنووسە" : "Enter your message"}
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className={`flex ${isKurdish ? 'justify-start' : 'justify-end'}`}>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg px-6 py-2 flex items-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>{isKurdish ? "دەنێردرێت..." : "Sending..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className={`h-4 w-4 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
                      <span>{isKurdish ? "ناردن" : "Send Message"}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Alternative Contact */}
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="p-5 border-b border-purple-500/20">
            <div className={`flex items-center ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <Mail className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-2' : 'mr-2'}`} />
              <p className={`text-sm font-semibold text-purple-200 ${isKurdish ? 'text-right' : ''}`}>
                {isKurdish ? "پەیوەندی ڕاستەوخۆ" : "Direct Contact"}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <p className={`text-sm text-purple-200 mb-3 ${isKurdish ? 'text-right kurdish use-local-kurdish' : ''}`}>
              {isKurdish 
                ? "دەتوانیت ڕاستەوخۆ پەیوەندیمان پێوە بکەیت لە ڕێگەی:"
                : "You can also reach us directly via:"}
            </p>
            
            <div className={`flex items-center mb-2 ${isKurdish ? 'flex-row-reverse' : ''}`}>
              <Mail className={`h-5 w-5 text-purple-300 ${isKurdish ? 'ml-3' : 'mr-3'}`} />
              <a href="mailto:support@chatkurd.com" className="text-purple-200 hover:text-white transition-colors">
                support@chatkurd.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 