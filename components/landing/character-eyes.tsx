"use client"

import { useEffect, useRef, useState } from "react"

export default function CharacterEyes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [eyePosition, setEyePosition] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } })
  const [smilePosition, setSmilePosition] = useState({ x: 0, y: 0, curve: 0 })
  const [isHoveringButton, setIsHoveringButton] = useState(false)

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

        // Check if mouse is over any navigation links or buttons
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
        const isOverButton = hoveredElement?.closest('a, button')
        setIsHoveringButton(!!isOverButton)
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

    // Calculate smile curve based on mouse position and button hover state
    const maxSmileCurve = isHoveringButton ? 25 : 15
    const baseCurve = isHoveringButton ? 15 : -15 // Positive (15) for smile when hovering buttons, Negative (-15) for sad when away
    const smileCurve = Math.min(Math.abs(mousePosition.y) / 10, maxSmileCurve)
    const smileX = Math.min(Math.abs(mousePosition.x) / 20, 5) * Math.sign(mousePosition.x)
    const smileY = Math.min(Math.abs(mousePosition.y) / 20, 3) * Math.sign(mousePosition.y)

    setSmilePosition({
      x: smileX,
      y: smileY,
      curve: baseCurve + (smileCurve * (mousePosition.y > 0 ? 0.5 : -0.5))
    })
  }, [mousePosition, isHoveringButton])

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

          {/* Interactive Smile */}
          <div 
            className="absolute bottom-1/4 left-1/4 right-1/4 h-1/6"
            style={{
              transform: `translate(${smilePosition.x}px, ${smilePosition.y}px)`,
            }}
          >
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full"
              style={{
                transform: `scale(${1 + Math.abs(smilePosition.curve) / 100})`,
              }}
            >
              <path
                d={`M 20,25 Q 50,${25 + smilePosition.curve} 80,25`}
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                className="transition-all duration-200"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
} 