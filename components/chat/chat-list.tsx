"use client"

import { format } from "date-fns"
import Link from "next/link"
import { MoreHorizontal, Trash2 } from "lucide-react"

import { Chat } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn, getAvatarColor } from "@/lib/utils"

interface ChatListProps {
  chats: Chat[]
  onDelete?: (chatId: string) => void
  className?: string
}

export function ChatList({ chats, onDelete, className }: ChatListProps) {
  if (!chats.length) return null
  
  return (
    <div className={cn("space-y-2", className)}>
      {chats.map((chat) => (
        <div 
          key={chat.id} 
          className="flex items-center rounded-lg border border-muted bg-background p-3 hover:bg-accent/10 transition-colors"
        >
          <Link 
            href={`/chat/${chat.id}`}
            className="flex flex-1 items-center gap-3 overflow-hidden"
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              {chat.character.avatar ? (
                <AvatarImage 
                  src={chat.character.avatar} 
                  alt={chat.character.name} 
                  className="object-cover" 
                />
              ) : (
                <AvatarFallback className={getAvatarColor(chat.character.name)}>
                  {chat.character.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-foreground truncate">
                  {chat.title || `Chat with ${chat.character.name}`}
                </h3>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {format(new Date(chat.updatedAt), "HH:mm")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {chat.character.name}
                </p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                  {format(new Date(chat.createdAt), "MMM d")}
                </span>
              </div>
            </div>
          </Link>
          
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="ml-2 h-8 w-8 p-0 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive flex cursor-pointer items-center"
                  onClick={() => onDelete(chat.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  )
} 