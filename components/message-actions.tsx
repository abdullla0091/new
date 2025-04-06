"use client"

import { useState } from "react"
import { Copy, Forward, Reply, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define props interface
interface MessageActionsProps {
  position: 'left' | 'right';
  onDelete: () => void;
}

export default function MessageActions({ position, onDelete }: MessageActionsProps) {
  const [showActions, setShowActions] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    // Get parent text content
    const messageElement = document.activeElement?.closest('div')?.textContent;
    if (messageElement) {
      navigator.clipboard.writeText(messageElement)
      toast({
        title: "Copied to clipboard",
        description: "Message content copied to clipboard",
        duration: 2000,
      })
    }
    setShowActions(false)
  }

  const handleForward = () => {
    toast({
      title: "Forward message",
      description: "Choose a contact to forward this message to",
      duration: 2000,
    })
    setShowActions(false)
  }

  const handleReply = () => {
    toast({
      title: "Reply to message",
      description: "Replying to this message",
      duration: 2000,
    })
    setShowActions(false)
  }

  return (
    <div 
      className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      onMouseEnter={() => setShowActions(true)} 
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions && (
        <div
          className={`absolute ${position === "left" ? "right-0" : "left-0"} -top-10 flex bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-1 z-10`}
        >
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={handleCopy} title="Copy">
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={handleReply} title="Reply">
            <Reply className="h-4 w-4 text-gray-500" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={handleForward}
            title="Forward"
          >
            <Forward className="h-4 w-4 text-gray-500" />
          </button>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={onDelete} title="Delete">
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  )
}

