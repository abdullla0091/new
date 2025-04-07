"use client" // For potential client-side interactions like logout

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import { User, Settings, LogOut, Star, Bell, Sun, MessageSquare, Clock, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfileItem from "@/components/profile-item";
import ImageUpload from "@/components/image-upload";
import { getUserImage, saveUserImage, removeUserImage, fileToBase64 } from "@/lib/image-storage";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { getTranslation } from "@/app/i18n/translations";

export default function ProfilePage() {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { language, isKurdish } = useLanguage();
  const t = (key: any) => getTranslation(language, key);

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
  }, []);

  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        setProfileImage(base64Image);
        saveUserImage(base64Image);
        toast({
          title: t("profileUpdated") || "Profile Updated", 
          description: t("profilePictureUpdated") || "Your profile picture has been updated.",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: t("uploadFailed") || "Upload Failed",
          description: t("failedToUpload") || "Failed to upload profile picture.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } else {
      setProfileImage(null);
      removeUserImage();
      toast({
        title: t("profileUpdated") || "Profile Updated",
        description: t("profilePictureRemoved") || "Your profile picture has been removed.",
        duration: 2000,
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: t("loggedOut") || "Logged Out",
      description: t("youHaveBeenLoggedOut") || "You have been logged out (placeholder).",
      duration: 2000,
    });
    // Placeholder logout logic - in a real app, redirect or clear auth state
  };

  const handleNavigate = (path: string) => {
    // In a real app, use next/navigation useRouter
    toast({ 
      title: t("navigation") || "Navigation", 
      description: `${t("navigatingTo") || "Navigating to"} ${path} (${t("placeholder") || "placeholder"})`, 
      duration: 1500 
    });
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-purple-950 to-indigo-950 text-white ${isKurdish ? 'kurdish' : ''}`}>
      {/* Profile Header */}
      <div className="relative h-60 bg-gradient-to-r from-purple-800 to-indigo-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-4">
            <ImageUpload
              value={profileImage || ''}
              onChange={handleImageChange}
              className="h-24 w-24 mx-auto"
              size="lg"
            />
          </div>
          
          {/* Single username element with proper spacing */}
          <h2 className={`text-xl font-semibold mb-3 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
            {isKurdish ? 'ناوی بەکارهێنەر' : 'User123'}
          </h2>
          
          {/* Account badge with proper spacing */}
          <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
            <span className={`text-xs text-purple-300 block ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
              {t("premium") || "Standard Account"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Profile Stats */}
      <div className="px-4 -mt-6 mb-4 relative z-10">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-purple-500/20">
            <div className="p-4 text-center">
              <div className="text-2xl font-semibold text-white">12</div>
              <div className={`text-xs text-purple-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("conversations") || "Conversations"}
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-semibold text-white">5</div>
              <div className={`text-xs text-purple-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("favorites") || "Favorites"}
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-semibold text-white">2</div>
              <div className={`text-xs text-purple-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("languages") || "Languages"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-4">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="p-4 border-b border-purple-500/20">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-300 mr-2" />
              <h3 className={`text-sm font-medium ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                {t("recentActivity") || "Recent Activity"}
              </h3>
            </div>
          </div>
          <div className="divide-y divide-purple-500/10">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center p-3 hover:bg-indigo-800/30">
                <div className="h-10 w-10 rounded-full bg-indigo-700/50 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
                    {isKurdish ? `گفتوگۆ لەگەڵ ${activity.title}` : `Chat with ${activity.title}`}
                  </div>
                  <div className="flex items-center text-xs text-purple-300">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className={isKurdish ? 'kurdish use-local-kurdish' : ''}>
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 pb-20">
        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <ProfileItem
            icon={<User className="h-5 w-5 text-purple-300" />}
            label={t("accountDetails") || "Account Details"}
            onClick={() => handleNavigate('/account')}
            textColor="text-white"
          />
          
          <Separator className="bg-purple-500/10" />
          
          <ProfileItem
            icon={<Star className="h-5 w-5 text-purple-300" />}
            label={t("favorites") || "Favorites"}
            onClick={() => handleNavigate('/favorites')}
            textColor="text-white"
          />
          
          <Separator className="bg-purple-500/10" />
          
          <ProfileItem
            icon={<Bell className="h-5 w-5 text-purple-300" />}
            label={t("notifications") || "Notifications"}
            onClick={() => handleNavigate('/notifications')}
            textColor="text-white"
          />
          
          <Separator className="bg-purple-500/10" />
          
          <ProfileItem
            icon={<Settings className="h-5 w-5 text-purple-300" />}
            label={t("settings") || "Settings"}
            onClick={() => handleNavigate('/settings')}
            textColor="text-white"
          />
        </div>
        
        {/* Appearance Section */}
        <div className="mt-4 bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <ProfileItem
            icon={<Sun className="h-5 w-5 text-purple-300" />}
            label={t("appearance") || "Appearance"}
            textColor="text-white"
          >
            <ThemeToggle variant="switch" />
          </ProfileItem>
        </div>
        
        {/* Logout Button */}
        <div className="mt-4 bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <ProfileItem
            icon={<LogOut className="h-5 w-5 text-red-400" />}
            label={t("logOut") || "Log Out"}
            textColor="text-red-400"
            onClick={handleLogout}
          >
            {/* Remove default chevron for logout */}
            <span></span>
          </ProfileItem>
        </div>
      </div>
    </div>
  );
}
