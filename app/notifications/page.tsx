"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, MessageSquare, Heart, User, Settings } from "lucide-react";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function NotificationsPage() {
  const router = useRouter();
  const { language, isKurdish } = useLanguage();

  // Sample notifications
  const notifications = [
    {
      id: 1,
      icon: <MessageSquare className="h-5 w-5 text-blue-400" />,
      title: isKurdish ? "گفتوگۆی نوێ" : "New message",
      description: isKurdish ? "تۆ گفتوگۆیەکی نوێت هەیە لە Sarah" : "You have a new conversation with Sarah",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      icon: <Heart className="h-5 w-5 text-red-400" />,
      title: isKurdish ? "دڵخوازکراو" : "Added to favorites",
      description: isKurdish ? "تۆ Einstein-ت زیاد کرد بۆ دڵخوازەکانت" : "You added Einstein to your favorites",
      time: "Yesterday",
      read: true
    },
    {
      id: 3,
      icon: <User className="h-5 w-5 text-green-400" />,
      title: isKurdish ? "کەسایەتی نوێ" : "New character",
      description: isKurdish ? "کەسایەتی Narin ئێستا بەردەستە" : "Narin character is now available",
      time: "3 days ago",
      read: true
    }
  ];

  // Notification settings
  const notificationSettings = [
    {
      id: "messages",
      label: isKurdish ? "ئاگادارکردنەوەی نامەکان" : "Message notifications",
      enabled: true
    },
    {
      id: "characters",
      label: isKurdish ? "کەسایەتی نوێ" : "New characters",
      enabled: true
    },
    {
      id: "updates",
      label: isKurdish ? "بەڕۆژکردنەوەی سیستەم" : "System updates",
      enabled: false
    }
  ];

  const handleNotificationClick = (id: number) => {
    // Mark notification as read and navigate if needed
    console.log(`Notification clicked: ${id}`);
  };

  const handleToggle = (settingId: string, value: boolean) => {
    console.log(`Setting ${settingId} changed to ${value}`);
    // Here you would update the user's notification preferences
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
          {isKurdish ? "ئاگادارکردنەوەکان" : "Notifications"}
        </h1>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6">
        {/* Recent Notifications */}
        <h2 className={cn("text-lg font-medium mb-4", isKurdish && "kurdish use-local-kurdish")}>
          {isKurdish ? "نوێترین" : "Recent"}
        </h2>
        
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden mb-8">
          {notifications.length > 0 ? (
            <div className="divide-y divide-purple-500/10">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-indigo-800/30 cursor-pointer",
                    !notification.read && "bg-indigo-800/20"
                  )}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className={cn("flex items-start", isKurdish && "flex-row-reverse")}>
                    <div className={cn("rounded-full p-2 bg-indigo-800/50", isKurdish ? "ml-3" : "mr-3")}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className={cn("flex items-center justify-between mb-1", isKurdish && "flex-row-reverse")}>
                        <h3 className={cn("font-medium", !notification.read && "text-white", notification.read && "text-purple-200", isKurdish && "kurdish use-local-kurdish")}>
                          {notification.title}
                        </h3>
                        <span className={cn("text-xs text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                          {notification.time}
                        </span>
                      </div>
                      <p className={cn("text-sm text-purple-200", isKurdish && "kurdish use-local-kurdish")}>
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 text-purple-400 mx-auto mb-3 opacity-50" />
              <p className={cn("text-purple-300", isKurdish && "kurdish use-local-kurdish")}>
                {isKurdish ? "هیچ ئاگادارکردنەوەیەکی نوێ نیە" : "No new notifications"}
              </p>
            </div>
          )}
        </div>
        
        {/* Notification Settings */}
        <h2 className={cn("text-lg font-medium mb-4", isKurdish && "kurdish use-local-kurdish")}>
          {isKurdish ? "ڕێکخستنەکان" : "Settings"}
        </h2>
        
        <div className="bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          {notificationSettings.map((setting, index) => (
            <div key={setting.id}>
              {index > 0 && <Separator className="bg-purple-500/10" />}
              <div className={cn("flex items-center justify-between p-4", isKurdish && "flex-row-reverse")}>
                <span className={cn("text-purple-100", isKurdish && "kurdish use-local-kurdish")}>
                  {setting.label}
                </span>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Clear All Button */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full bg-indigo-900/50 border-purple-500/30 text-white hover:bg-indigo-800/50"
            onClick={() => console.log('Clear all notifications')}
          >
            {isKurdish ? "سڕینەوەی هەموو ئاگادارکردنەوەکان" : "Clear all notifications"}
          </Button>
        </div>
      </div>
    </div>
  );
} 