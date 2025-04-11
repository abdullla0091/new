"use client" // For potential client-side interactions like logout

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Settings, LogOut, Star, Bell, Sun, MessageSquare, Clock, Activity, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ImageUpload from "@/components/image-upload";
import { getUserImage, saveUserImage, removeUserImage, fileToBase64 } from "@/lib/image-storage";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { getTranslation } from "@/app/i18n/translations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Component for profile menu item
const ProfileItem = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  isRtl
}: { 
  icon: any; 
  title: string; 
  description: string; 
  onClick: () => void;
  isRtl?: boolean;
}) => (
  <div 
    className={cn(
      "flex items-center p-4 hover:bg-indigo-800/30 rounded-lg cursor-pointer transition-colors", 
      isRtl ? "flex-row-reverse text-right" : ""
    )}
    onClick={onClick}
  >
    <div className={cn("bg-indigo-800/60 p-3 rounded-full", isRtl ? "ml-0" : "")}>
      <Icon className="h-5 w-5 text-indigo-200" />
    </div>
    <div className={cn("ml-4", isRtl ? "mr-4 ml-0" : "")}>
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-sm text-indigo-200">{description}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { language, isKurdish } = useLanguage();
  const t = (key: any) => getTranslation(language, key);
  const [mounted, setMounted] = useState(false);

  // Placeholder user data
  const user = {
    username: isKurdish ? 'ناوی بەکارهێنەر' : 'User123',
    email: 'user@example.com',
  };

  // Placeholder activity data
  const recentActivity = [
    { id: 1, title: 'Sarah', time: '2 hours ago', type: 'conversation' },
    { id: 2, title: 'Einstein', time: '1 day ago', type: 'conversation' },
    { id: 3, title: 'Chef', time: '3 days ago', type: 'conversation' }
  ];

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = getUserImage();
    if (savedImage) {
      setProfileImage(savedImage);
    }
    setMounted(true);
  }, []);

  // Image upload handler
  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setProfileImage(base64);
        saveUserImage(base64);
        
        toast({
          title: isKurdish ? t("profilePictureUpdated") : "Profile Picture Updated",
          description: isKurdish ? t("profilePictureUpdated") : "Your profile picture has been updated.",
          duration: 2000,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: isKurdish ? t("uploadFailed") : "Upload Failed",
          description: isKurdish ? t("failedToUpload") : "Failed to upload your profile picture.",
          duration: 2000,
        });
      }
    }
  };

  // Image remove handler
  const handleRemoveImage = () => {
    setProfileImage(null);
    removeUserImage();
    
    toast({
      title: isKurdish ? t("profilePictureRemoved") : "Profile Picture Removed",
      description: isKurdish ? t("profilePictureRemoved") : "Your profile picture has been removed.",
      duration: 2000,
    });
  };

  // Logout handler
  const handleLogout = () => {
    // Clear any user data
    localStorage.removeItem('userToken');
    
    toast({
      title: isKurdish ? t("loggedOut") : "Logged Out",
      description: isKurdish ? t("youHaveBeenLoggedOut") : "You have been logged out.",
      duration: 2000,
    });
    
    // Redirect to home page
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // Navigation handler
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Handle chat navigation
  const handleChatNavigation = (character: string) => {
    router.push(`/chat/${character.toLowerCase()}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      dir={isKurdish ? "rtl" : "ltr"}
      className="flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white"
    >
      {/* Header */}
      <div className={cn("p-4 flex items-center", isKurdish && "justify-start flex-row-reverse")}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full text-white hover:bg-white/10 mx-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isKurdish ? "پڕۆفایل" : "Profile"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 flex-1">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 mb-6">
          {/* Profile Header */}
          <div className="p-6 flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-2 ring-2 ring-purple-500/30">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={user.username} />
                ) : (
                  <AvatarFallback className="bg-indigo-700">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="mt-2 flex justify-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-purple-500/30 hover:bg-purple-500/20 text-purple-200"
                  onClick={() => document.getElementById('profile-image-upload')?.click()}
                >
                  {isKurdish ? "گۆڕین" : "Change"}
                </Button>
                
                {profileImage && (
                  <Button
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-red-500/30 hover:bg-red-500/20 text-red-200"
                    onClick={handleRemoveImage}
                  >
                    {isKurdish ? "سڕینەوە" : "Remove"}
                  </Button>
                )}
                
                <input 
                  id="profile-image-upload"
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mt-4">{user.username}</h2>
            <p className="text-indigo-300">{user.email}</p>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className={cn("space-y-4", isKurdish && "text-right")}>
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
            <ProfileItem 
              icon={Settings} 
              title={isKurdish ? "ڕێکخستنەکان" : "Settings"}
              description={isKurdish ? "ڕێکخستنەکانی هەژمار و پەیوەندیکردن" : "Account & app preferences"} 
              onClick={() => handleNavigate('/settings')}
              isRtl={isKurdish}
            />
            <Separator className="bg-indigo-800/50" />
            <ProfileItem 
              icon={Star} 
              title={isKurdish ? "دڵخوازەکان" : "Favorites"}
              description={isKurdish ? "کەسایەتییە دڵخوازەکانت" : "Your favorite characters"} 
              onClick={() => handleNavigate('/favorites')}
              isRtl={isKurdish}
            />
            <Separator className="bg-indigo-800/50" />
            <ProfileItem 
              icon={Bell} 
              title={isKurdish ? "ئاگادارکردنەوەکان" : "Notifications"}
              description={isKurdish ? "بەڕێوەبردنی ئاگادارکردنەوەکان" : "Manage notification settings"} 
              onClick={() => handleNavigate('/notifications')}
              isRtl={isKurdish}
            />
          </div>
          
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
            <h3 className={cn("px-4 pt-4 text-lg font-medium", isKurdish && "text-right")}>
              {isKurdish ? "چالاکی دوایی" : "Recent Activity"}
            </h3>
            
            <div className="p-2">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className={cn(
                    "flex items-center p-2 hover:bg-indigo-800/30 rounded-lg cursor-pointer transition-colors", 
                    isKurdish ? "flex-row-reverse text-right" : ""
                  )}
                  onClick={() => activity.type === 'conversation' && handleChatNavigation(activity.title)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-700">{activity.title[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn("ml-3", isKurdish ? "mr-3 ml-0" : "")}>
                    <p className="font-medium">
                      {isKurdish ? `چات لەگەڵ ${activity.title}` : `Chat with ${activity.title}`}
                    </p>
                    <p className="text-sm text-indigo-300">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Logout */}
          <div 
            className={cn(
              "flex items-center p-4 bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:bg-indigo-800/30 cursor-pointer transition-colors", 
              isKurdish ? "flex-row-reverse text-right" : ""
            )}
            onClick={handleLogout}
          >
            <div className="bg-red-500/20 p-3 rounded-full">
              <LogOut className="h-5 w-5 text-red-300" />
            </div>
            <div className={cn("ml-4", isKurdish ? "mr-4 ml-0" : "")}>
              <h3 className="font-medium text-red-200">
                {isKurdish ? "چوونەدەرەوە" : "Log Out"}
              </h3>
              <p className="text-sm text-red-300/70">
                {isKurdish ? "چوونەدەرەوە لە هەژمارەکەت" : "Sign out of your account"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
