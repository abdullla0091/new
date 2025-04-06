"use client"

import { useEffect, useRef } from "react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null)

  // Common emojis
  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🙏",
    "😍",
    "😭",
    "🥰",
    "😘",
    "🤔",
    "🙄",
    "😬",
    "😁",
    "😎",
    "🔥",
    "✨",
    "🎉",
    "👏",
    "🤗",
    "🤣",
    "😅",
    "😉",
    "🥺",
    "😴",
  ]

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="grid grid-cols-6 gap-2">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
            onClick={() => onEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

