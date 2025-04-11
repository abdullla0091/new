import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Reaction options
const REACTIONS = [
  { emoji: '❤️', name: 'heart' },
  { emoji: '👍', name: 'thumbs_up' },
  { emoji: '👎', name: 'thumbs_down' },
  { emoji: '😂', name: 'laugh' },
  { emoji: '😮', name: 'wow' },
  { emoji: '😢', name: 'sad' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '👏', name: 'clap' },
];

interface MessageReactionProps {
  messageId: string;
  reactions?: Record<string, string[]>;
  onAddReaction: (messageId: string, reaction: string) => void;
  onRemoveReaction: (messageId: string, reaction: string) => void;
  currentUser: string;
}

export default function MessageReaction({
  messageId,
  reactions = {},
  onAddReaction,
  onRemoveReaction,
  currentUser
}: MessageReactionProps) {
  const [open, setOpen] = useState(false);
  
  // Get total reaction count
  const getTotalReactionCount = () => {
    return Object.values(reactions).reduce((acc, users) => acc + users.length, 0);
  };
  
  // Handle reaction click
  const handleReactionClick = (reaction: string) => {
    const reactionUsers = reactions[reaction] || [];
    
    if (reactionUsers.includes(currentUser)) {
      onRemoveReaction(messageId, reaction);
    } else {
      onAddReaction(messageId, reaction);
    }
    
    setOpen(false);
  };
  
  // Check if user has already added a specific reaction
  const hasUserReacted = (reaction: string) => {
    return (reactions[reaction] || []).includes(currentUser);
  };
  
  return (
    <div className="flex items-center gap-1">
      {/* Reaction picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-indigo-800/30"
          >
            <SmilePlus className="h-4 w-4 text-indigo-300" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-2 flex-wrap">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.name}
                className={`text-lg hover:bg-indigo-800/30 p-1 rounded transition-colors ${
                  hasUserReacted(reaction.emoji) ? 'bg-indigo-800/50' : ''
                }`}
                onClick={() => handleReactionClick(reaction.emoji)}
                title={reaction.name}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Display existing reactions */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(reactions).map(([emoji, users]) => 
          users.length > 0 ? (
            <button
              key={emoji}
              className={`text-xs flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                hasUserReacted(emoji)
                  ? 'bg-indigo-700/50 hover:bg-indigo-700/70'
                  : 'bg-indigo-800/30 hover:bg-indigo-800/50'
              } transition-colors`}
              onClick={() => handleReactionClick(emoji)}
              title={`${users.join(', ')}`}
            >
              <span>{emoji}</span>
              <span className="text-indigo-200 font-medium">{users.length}</span>
            </button>
          ) : null
        )}
      </div>
    </div>
  );
} 