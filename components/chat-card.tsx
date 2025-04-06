"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Pin, Sparkles, Star, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface ChatCardProps {
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  trending?: boolean
  favorite?: boolean
  online?: boolean
}

// Generate a background color based on the name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-pink-500", "bg-indigo-500", "bg-red-500"
  ];
  
  // Use the name's initial as a simple hash function
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function ChatCard({
  name,
  avatar,
  lastMessage,
  time,
  unread,
  trending = false,
  favorite = false,
  online = false,
}: ChatCardProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(favorite)
  const [isPinned, setIsPinned] = useState(false)
  const { toast } = useToast()
  const avatarColor = getAvatarColor(name);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? `${name} removed from favorites` : `${name} added to favorites`,
      duration: 2000,
    })
  }

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPinned(!isPinned)
    toast({
      title: isPinned ? "Chat unpinned" : "Chat pinned",
      description: isPinned ? `${name} unpinned from top` : `${name} pinned to top`,
      duration: 2000,
    })
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Chat deleted",
      description: `Chat with ${name} has been deleted`,
      duration: 2000,
    })
  }

  // Generate a URL-friendly ID
  const chatId = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="flex items-center p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
      onClick={() => router.push(`/chat/${chatId}`)}
    >
      <div className="relative">
        <Avatar>
          {avatar && !avatar.includes('default') ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className={`${avatarColor} text-white`}>
              {name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        {trending && (
          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        )}
        {online && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{name}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lastMessage}</p>
      </div>
      <div className="flex items-center">
        {unread > 0 && (
          <div className="mr-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unread}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleFavoriteClick}>
              <Star className={`h-4 w-4 mr-2 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`} />
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePinClick}>
              <Pin className={`h-4 w-4 mr-2 ${isPinned ? "text-blue-500" : "text-gray-500"}`} />
              {isPinned ? "Unpin chat" : "Pin chat"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

