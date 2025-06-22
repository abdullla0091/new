"use client" // For potential client-side interactions like logout

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import { User, Settings, LogOut, Star, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProfileItem from "@/components/profile-item";
import ImageUpload from "@/components/image-upload";
import { getUserImage, saveUserImage, removeUserImage, fileToBase64 } from "@/lib/image-storage";

export default function ProfilePage() {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Placeholder user data
  const user = {
    username: 'User123',
    email: 'user@example.com',
  };

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
          title: "Profile Updated",
          description: "Your profile picture has been updated.",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload profile picture.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } else {
      setProfileImage(null);
      removeUserImage();
      toast({
        title: "Profile Updated",
        description: "Your profile picture has been removed.",
        duration: 2000,
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out (placeholder).",
      duration: 2000,
    });
    // Placeholder logout logic - in a real app, redirect or clear auth state
  };

  const handleNavigate = (path: string) => {
    // In a real app, use next/navigation useRouter
    toast({ title: "Navigation", description: `Navigating to ${path} (placeholder)`, duration: 1500 });
  };

  return (
    <div className="flex flex-col flex-grow p-4 space-y-6 overflow-y-auto pb-20"> {/* Added padding-bottom for TabBar */}
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* User Info Section */}
      <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="mb-4">
          <ImageUpload
            value={profileImage || ''}
            onChange={handleImageChange}
            className="h-24 w-24 mx-auto"
          />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Profile Options */}
      <div className="space-y-2">
         <ProfileItem
          icon={<User className="h-5 w-5 text-gray-500" />}
          label="Account Details"
          onClick={() => handleNavigate('/account')}
        />
         <ProfileItem
          icon={<Star className="h-5 w-5 text-gray-500" />}
          label="Favorites"
          onClick={() => handleNavigate('/favorites')} // Link to favorites page
        />
        <ProfileItem
          icon={<Bell className="h-5 w-5 text-gray-500" />}
          label="Notifications"
          onClick={() => handleNavigate('/notifications')}
        />
        <ProfileItem
          icon={<Settings className="h-5 w-5 text-gray-500" />}
          label="Settings"
          onClick={() => handleNavigate('/settings')} // Link to settings page
        />
      </div>

      <Separator />

      {/* Theme Toggle */}
      <ProfileItem
        icon={ <ThemeToggle variant="button" /> } // Use button variant for icon slot
        label="Appearance"
      >
        <ThemeToggle variant="switch" /> {/* Use switch variant as the child */}
      </ProfileItem>

      <Separator />

      {/* Logout Button */}
      <ProfileItem
        icon={<LogOut className="h-5 w-5 text-red-500" />}
        label="Log Out"
        textColor="text-red-500"
        onClick={handleLogout}
      >
        {/* Remove default chevron for logout */}
        <span></span>
      </ProfileItem>

    </div>
  );
}
