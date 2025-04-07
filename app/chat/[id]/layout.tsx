import React from 'react'
import TabBar from '@/components/tab-bar'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Don't render TabBar for chat pages */}
      {children}
    </>
  )
} 