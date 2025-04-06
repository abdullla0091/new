"use client"

import { useState, useEffect } from 'react'
import { X, UserPlus, User, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Only run on client-side to avoid SSR issues
    if (typeof window !== 'undefined') {
      try {
        const hasVisited = localStorage.getItem('hasVisitedBefore')
        if (!hasVisited) {
          setIsOpen(true)
          localStorage.setItem('hasVisitedBefore', 'true')
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
      }
    }
  }, [])
  
  const handleClose = () => {
    setIsOpen(false)
  }
  
  const handleCreateAccount = () => {
    router.push('/auth/signup')
    setIsOpen(false)
  }
  
  const handleContinueAsGuest = () => {
    setIsOpen(false)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform transition-all">
        {/* Background design with gradient */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 relative">
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200 p-1 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <MessageSquare className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-bold text-center">Welcome to Kurdish Chat!</h2>
          <p className="text-white/80 mt-2 text-center">Connect with Kurdish characters and personalities</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <button
              onClick={handleCreateAccount}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create an Account</span>
            </button>
            
            <button
              onClick={handleContinueAsGuest}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Continue as Guest</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
            By using our app, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
} 