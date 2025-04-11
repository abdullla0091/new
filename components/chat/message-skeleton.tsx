import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageSkeletonProps {
  count?: number;
  isIncoming?: boolean;
}

export default function MessageSkeleton({ 
  count = 3,
  isIncoming = true 
}: MessageSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
        >
          <div className="flex items-start gap-3 max-w-[85%]">
            {isIncoming && (
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            )}
            <div className={`space-y-2 ${isIncoming ? '' : 'order-first mr-3'}`}>
              <div className="flex items-center gap-2">
                {isIncoming && <Skeleton className="h-4 w-24" />}
                <Skeleton className="h-3 w-16" />
              </div>
              <div>
                <Skeleton className={`h-16 w-${Math.max(index * 20 + 40, 60)} max-w-md rounded-xl`} />
              </div>
            </div>
            {!isIncoming && (
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 