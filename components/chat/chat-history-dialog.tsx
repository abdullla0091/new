"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, Download, Trash2, ArchiveIcon, TypeIcon } from "lucide-react"
import { differenceInDays, format, formatDistanceToNow } from "date-fns"

import { removeChat, clearAllChats } from "@/actions/chat"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { ChatList } from "@/components/chat/chat-list"
import { Chat } from "@/types"

interface ChatHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chats: Chat[]
}

export function ChatHistoryDialog({ open, onOpenChange, chats }: ChatHistoryProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; all: boolean }>({ 
    show: false, 
    all: false 
  })
  
  // Group chats by date
  const chatsByDate = chats.reduce((acc, chat) => {
    const date = new Date(chat.createdAt)
    const dateKey = format(date, "yyyy-MM-dd")
    
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    
    acc[dateKey].push(chat)
    return acc
  }, {} as Record<string, Chat[]>)
  
  // Sort date keys from newest to oldest
  const sortedDateKeys = Object.keys(chatsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  
  // Export chat to JSON
  const exportChatHistory = () => {
    if (!chats.length) return
    
    const dataToExport = chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      characterName: chat.character.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }))
    
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    
    const exportFileDefaultName = `chat-history-${format(new Date(), "yyyy-MM-dd")}.json`
    
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    
    toast({
      title: "Chat history exported",
      description: `Exported ${chats.length} conversations to JSON`,
      duration: 3000
    })
  }
  
  // Clear all chats
  const handleClearAllChats = () => {
    if (confirmDelete.show && confirmDelete.all) {
      startTransition(async () => {
        try {
          await clearAllChats()
          toast({
            title: "Chat history cleared",
            description: "All conversations have been deleted",
            duration: 3000
          })
          setConfirmDelete({ show: false, all: false })
          onOpenChange(false)
          router.refresh()
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to clear chat history",
            variant: "destructive",
            duration: 3000
          })
        }
      })
    } else {
      setConfirmDelete({ show: true, all: true })
    }
  }
  
  // Delete single chat
  const handleDeleteChat = (chatId: string) => {
    if (confirmDelete.show && !confirmDelete.all && selectedChat?.id === chatId) {
      startTransition(async () => {
        try {
          await removeChat(chatId)
          toast({
            title: "Chat deleted",
            description: "The conversation has been removed",
            duration: 3000
          })
          setConfirmDelete({ show: false, all: false })
          setSelectedChat(null)
          router.refresh()
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the chat",
            variant: "destructive",
            duration: 3000
          })
        }
      })
    } else {
      setSelectedChat(chats.find(chat => chat.id === chatId) || null)
      setConfirmDelete({ show: true, all: false })
    }
  }
  
  // Cancel deletion
  const cancelDelete = () => {
    setConfirmDelete({ show: false, all: false })
    setSelectedChat(null)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
          <DialogDescription>
            View and manage your conversation history
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Recent Chats</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-1">
              <ArchiveIcon className="h-4 w-4" />
              <span>Manage History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-0">
            <ScrollArea className="h-[50vh] pr-4">
              {sortedDateKeys.length > 0 ? (
                sortedDateKeys.map(dateKey => {
                  const chatsForDate = chatsByDate[dateKey]
                  const date = new Date(dateKey)
                  const daysDiff = differenceInDays(new Date(), date)
                  
                  let dateLabel = ""
                  if (daysDiff === 0) {
                    dateLabel = "Today"
                  } else if (daysDiff === 1) {
                    dateLabel = "Yesterday"
                  } else if (daysDiff < 7) {
                    dateLabel = format(date, "EEEE")
                  } else {
                    dateLabel = format(date, "MMMM d, yyyy")
                  }
                  
                  return (
                    <div key={dateKey} className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">{dateLabel}</h3>
                      </div>
                      <div className="space-y-2">
                        <ChatList 
                          chats={chatsForDate} 
                          onDelete={handleDeleteChat}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <TypeIcon className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Start chatting with a character to see your history here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="manage" className="mt-0">
            <div className="space-y-4">
              <div className="bg-muted/40 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export History
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download your chat history as a JSON file to keep a backup of your conversations.
                </p>
                <Button 
                  onClick={exportChatHistory} 
                  disabled={!chats.length}
                  className="text-xs h-8"
                >
                  Export to JSON
                </Button>
              </div>
              
              <div className="bg-destructive/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-destructive">
                  <Trash2 className="h-4 w-4" />
                  Clear History
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Delete all your conversations. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleClearAllChats}
                  disabled={!chats.length || isPending}
                  className="text-xs h-8"
                >
                  {confirmDelete.show && confirmDelete.all 
                    ? "Confirm Clear All" 
                    : "Clear All Chats"}
                </Button>
                {confirmDelete.show && confirmDelete.all && (
                  <Button 
                    variant="outline" 
                    onClick={cancelDelete}
                    className="text-xs h-8 ml-2"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {confirmDelete.show && !confirmDelete.all && selectedChat && (
          <>
            <Separator />
            <div className="bg-destructive/10 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Delete this conversation?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Are you sure you want to delete &quot;{selectedChat.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteChat(selectedChat.id)}
                  disabled={isPending}
                  size="sm"
                >
                  {isPending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={cancelDelete}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
        
        <DialogFooter className="flex justify-between items-center sm:justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 