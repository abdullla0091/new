"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Shield } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  const router = useRouter();
  const { language, isKurdish } = useLanguage();

  // Placeholder user data
  const userData = {
    name: isKurdish ? 'ناوی بەکارهێنەر' : 'User123',
    email: 'user@example.com',
    joined: 'April 10, 2024',
    plan: isKurdish ? 'ستاندارد' : 'Standard'
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`} dir={isKurdish ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className={cn("rounded-full text-white hover:bg-white/10", isKurdish ? "ml-2" : "mr-2")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "ژمارەی کەسی" : "Account Details"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          {/* Account Info Section */}
          <div className="p-6 space-y-4">
            <div className={cn("flex items-center", isKurdish && "flex-row-reverse")}>
              <User className={cn("h-5 w-5 text-purple-300", isKurdish ? "ml-3" : "mr-3")} />
              <div>
                <p className={cn("text-xs text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                  {isKurdish ? "ناو" : "Name"}
                </p>
                <p className={cn("text-base", isKurdish && "kurdish use-local-kurdish")}>
                  {userData.name}
                </p>
              </div>
            </div>
            
            <Separator className="bg-purple-500/10" />
            
            <div className={cn("flex items-center", isKurdish && "flex-row-reverse")}>
              <Mail className={cn("h-5 w-5 text-purple-300", isKurdish ? "ml-3" : "mr-3")} />
              <div>
                <p className={cn("text-xs text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                  {isKurdish ? "ئیمەیڵ" : "Email"}
                </p>
                <p className="text-base">
                  {userData.email}
                </p>
              </div>
            </div>
            
            <Separator className="bg-purple-500/10" />
            
            <div className={cn("flex items-center", isKurdish && "flex-row-reverse")}>
              <Calendar className={cn("h-5 w-5 text-purple-300", isKurdish ? "ml-3" : "mr-3")} />
              <div>
                <p className={cn("text-xs text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                  {isKurdish ? "بەشداری کردووە لە" : "Joined"}
                </p>
                <p className={cn("text-base", isKurdish && "kurdish use-local-kurdish")}>
                  {userData.joined}
                </p>
              </div>
            </div>
            
            <Separator className="bg-purple-500/10" />
            
            <div className={cn("flex items-center", isKurdish && "flex-row-reverse")}>
              <Shield className={cn("h-5 w-5 text-purple-300", isKurdish ? "ml-3" : "mr-3")} />
              <div>
                <p className={cn("text-xs text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                  {isKurdish ? "پلان" : "Plan"}
                </p>
                <p className={cn("text-base", isKurdish && "kurdish use-local-kurdish")}>
                  {userData.plan}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 space-y-4">
          <Button 
            variant="outline" 
            className="w-full bg-indigo-900/50 border-purple-500/30 text-white hover:bg-indigo-800/50"
            onClick={() => router.push('/settings')}
          >
            {isKurdish ? "گۆڕینی ناو و وشەی نهێنی" : "Edit Profile Information"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-indigo-900/50 border-purple-500/30 text-white hover:bg-indigo-800/50"
            onClick={() => router.push('/settings')}
          >
            {isKurdish ? "ڕێکخستنەکانی ئەکاونت" : "Account Settings"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-indigo-900/50 border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
            onClick={() => router.push('/settings')}
          >
            {isKurdish ? "سڕینەوەی ئەکاونت" : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
} 