'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface VerificationCodeInputProps {
  length?: number
  onComplete: (code: string) => void
  isLoading?: boolean
}

export default function VerificationCodeInput({
  length = 4,
  onComplete,
  isLoading = false
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize inputRefs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    // Update the code state with the new digit
    const newCode = [...code]
    newCode[index] = value.substring(value.length - 1)
    setCode(newCode)

    // Auto focus next input if available
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // If code is complete, call onComplete
    if (value && index === length - 1) {
      const fullCode = newCode.join('')
      if (fullCode.length === length) {
        onComplete(fullCode)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    
    // If pasted data is all digits and correct length, fill the inputs
    if (/^\d+$/.test(pastedData) && pastedData.length <= length) {
      const pastedChars = pastedData.split('').slice(0, length)
      const newCode = [...code]
      
      pastedChars.forEach((char, index) => {
        newCode[index] = char
      })
      
      setCode(newCode)
      
      // Focus on the next empty input or last one
      const focusIndex = Math.min(pastedChars.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
      
      // If we've filled the whole code, call onComplete
      if (pastedChars.length === length) {
        onComplete(pastedChars.join(''))
      }
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-center items-center space-x-2 mb-4">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="relative">
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              className={`w-12 h-14 text-center text-xl font-bold rounded border 
                ${isLoading ? 'bg-gray-100 text-gray-400' : 'bg-white text-black'} 
                focus:border-blue-500 focus:ring-blue-500 focus:outline-none`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>
      
      <Button 
        onClick={() => onComplete(code.join(''))} 
        disabled={code.join('').length !== length || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify'
        )}
      </Button>
    </div>
  )
} 