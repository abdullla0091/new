'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface VerificationCodeInputProps {
  length?: number
  onComplete: (code: string) => void
}

export default function VerificationCodeInput({
  length = 6,
  onComplete
}: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''))
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const num = e.target.value
    if (/[^0-9]/.test(num)) return
    const newCode = [...code]
    newCode[slot] = num
    setCode(newCode)
    
    if (slot !== length - 1 && num !== '') {
      inputs.current[slot + 1]?.focus()
    }
    
    if (newCode.every(num => num !== '')) {
      onComplete(newCode.join(''))
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === 'Backspace' && !code[slot] && slot !== 0) {
      const newCode = [...code]
      newCode[slot - 1] = ''
      setCode(newCode)
      inputs.current[slot - 1]?.focus()
    }
  }

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  return (
    <div className="flex gap-2 justify-center">
      {code.map((num, idx) => (
        <Input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={num}
          autoFocus={!code[0].length && idx === 0}
          onChange={(e) => processInput(e, idx)}
          onKeyUp={(e) => onKeyUp(e, idx)}
          ref={(ref) => inputs.current[idx] = ref}
          className="w-10 h-12 text-center text-2xl"
        />
      ))}
    </div>
  )
} 