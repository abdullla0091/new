"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, User, X, Camera } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/app/i18n/LanguageContext'
import { getTranslation } from '@/app/i18n/translations'

interface ImageUploadProps {
  value?: string | null
  onChange?: (file: File | null) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  name?: string
  customFallback?: React.ReactNode
}

// Generate a background gradient based on the character name
function getAvatarGradient(name: string = ''): string {
  const gradients = [
    "from-purple-600 to-indigo-600",
    "from-indigo-600 to-blue-600", 
    "from-blue-600 to-cyan-600",
    "from-cyan-600 to-teal-600",
    "from-teal-600 to-green-600",
    "from-pink-600 to-rose-600",
    "from-rose-600 to-red-600",
    "from-orange-600 to-amber-600"
  ];
  
  // Use the character's initial as a simple hash function
  const index = name.length > 0 ? name.charCodeAt(0) % gradients.length : 0;
  return gradients[index];
}

export default function ImageUpload({
  value,
  onChange,
  className = '',
  size = 'md',
  name = '',
  customFallback
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { language, isKurdish } = useLanguage()
  const t = (key: any) => getTranslation(language, key)
  const avatarGradient = getAvatarGradient(name);

  // Update preview when value changes
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  // Size classes
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    processFile(file)
  }

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive"
      })
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      })
      return
    }

    try {
      setIsUploading(true)
      
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
      
      // Call onChange with the file
      if (onChange) {
        onChange(file)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Upload failed",
        description: "There was an error processing your image",
        variant: "destructive"
      })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (onChange) onChange(null)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  return (
    <div 
      className={`flex flex-col items-center ${className}`}
      onDragEnter={handleDrag}
    >
      <div 
        className={`relative cursor-pointer ${dragActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={triggerFileInput}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className={`rounded-full bg-gradient-to-br ${avatarGradient} p-0.5`}>
          <Avatar className={`${sizeClasses[size]} border-2 border-purple-500/20`}>
            {preview ? (
              <AvatarImage src={preview} alt={name || "Avatar"} />
            ) : customFallback ? (
              <AvatarFallback className="bg-indigo-800 text-white">
                {customFallback}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-indigo-800 text-white">
                {name ? name.charAt(0).toUpperCase() : <User className="h-1/2 w-1/2 text-gray-200" />}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        {preview && (
          <button 
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
          >
            <X className="h-3 w-3" />
          </button>
        )}
        
        <button 
          className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 text-white"
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          disabled={isUploading}
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      
      {isUploading && (
        <div className={`mt-2 text-xs text-purple-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
          {t("uploading") || "Uploading..."}
        </div>
      )}
      
      {!preview && !isUploading && (
        <div className={`mt-1 text-xs text-purple-300 ${isKurdish ? 'kurdish use-local-kurdish' : ''}`}>
          {/* Don't show this text in profile page context */}
        </div>
      )}
    </div>
  )
} 