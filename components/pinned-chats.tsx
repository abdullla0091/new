"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pin } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { getPinnedChats, StoredChat } from "@/lib/chat-storage"
import { getCharacterById } from "@/lib/characters"

interface PinnedChatsProps {
  className?: string
}

// Function to generate a consistent color based on name
function getAvatarColor(name: string) {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500"
  ];
  
  // Get a consistent index based on the name
  const charCode = name.charCodeAt(0) || 0;
  const index = charCode % colors.length;
  
  return colors[index];
}

interface PinnedChatDisplay {
  id: string;
  name: string;
  avatar: string | null;
  characterId: string;
}

export default function PinnedChats({ className }: PinnedChatsProps) {
  const router = useRouter()
  const [pinnedChats, setPinnedChats] = useState<PinnedChatDisplay[]>([])

  // Load pinned chats from localStorage
  useEffect(() => {
    const storedPinnedChats = getPinnedChats();
    
    // Map to display format
    const displayChats = storedPinnedChats.map(chat => {
      const character = getCharacterById(chat.characterId);
      return {
        id: chat.id,
        name: character?.name || chat.title || 'Chat',
        avatar: character?.avatar || null,
        characterId: chat.characterId
      };
    });
    
    setPinnedChats(displayChats);
  }, []);

  if (pinnedChats.length === 0) return null

  return (
    <div className={cn("", className)}>
      <div className="flex items-center mb-3">
        <Pin className="h-4 w-4 text-gray-500 mr-2" />
        <h2 className="text-sm font-medium text-gray-500">Pinned</h2>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {pinnedChats.map((chat) => (
          <div
            key={chat.id}
            className="flex flex-col items-center"
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <div className="relative cursor-pointer">
              <Avatar className="h-14 w-14">
                <AvatarImage src={chat.avatar || undefined} alt={chat.name} />
                <AvatarFallback className={getAvatarColor(chat.name)}>
                  <span className="text-white">{chat.name.charAt(0)}</span>
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <Pin className="h-3 w-3 text-white" />
              </div>
            </div>
            <span className="text-xs mt-1 text-center">{chat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

