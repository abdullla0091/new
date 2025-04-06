"use client"

import { useEffect, useRef, useState } from "react"

export default function CharacterEyes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyePosition, setEyePosition] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        setMousePosition({
          x: e.clientX - centerX,
          y: e.clientY - centerY,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    // Calculate eye movement (limit the movement to a certain radius)
    const maxRadius = 8
    const angle = Math.atan2(mousePosition.y, mousePosition.x)
    const distance = Math.min(Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2), maxRadius * 2)
    const radius = Math.min(distance / 2, maxRadius)

    setEyePosition({
      left: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      },
      right: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      },
    })
  }, [mousePosition])

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10 w-24 h-24 md:w-32 md:h-32"
    >
      <div className="relative w-full h-full">
        {/* Character face */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full shadow-lg">
          {/* Left eye */}
          <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 bg-white rounded-full flex items-center justify-center">
            <div
              className="w-1/2 h-1/2 bg-indigo-900 rounded-full"
              style={{
                transform: `translate(${eyePosition.left.x}px, ${eyePosition.left.y}px)`,
              }}
            />
          </div>

          {/* Right eye */}
          <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-white rounded-full flex items-center justify-center">
            <div
              className="w-1/2 h-1/2 bg-indigo-900 rounded-full"
              style={{
                transform: `translate(${eyePosition.right.x}px, ${eyePosition.right.y}px)`,
              }}
            />
          </div>

          {/* Smile */}
          <div className="absolute bottom-1/4 left-1/3 right-1/3 h-1/6 border-b-4 border-white rounded-full" />
        </div>
      </div>
    </div>
  )
}

