"use client"

import { useEffect, useRef } from "react"

export default function SimplifiedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to fill the viewport
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 2
        this.speedX = (Math.random() - 0.5) * 0.8 // Slightly faster
        this.speedY = (Math.random() - 0.5) * 0.8 // Slightly faster

        // More vibrant color palette with higher saturation and brightness
        const colorOptions = [
          `hsla(${Math.random() * 60 + 240}, 90%, 75%, ${Math.random() * 0.3 + 0.2})`, // Blues and purples
          `hsla(${Math.random() * 40 + 280}, 90%, 75%, ${Math.random() * 0.3 + 0.2})`, // Purples and pinks
          `hsla(360, 90%, 75%, ${Math.random() * 0.3 + 0.2})`, // Reds
          `hsla(320, 90%, 75%, ${Math.random() * 0.3 + 0.2})`, // Magentas
        ];
        this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }
    }

    // Create a limited number of particles
    const particlesArray: Particle[] = []
    const numberOfParticles = 150 // Increased from 100 for more vibrance

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with a slight trail effect
      ctx.fillStyle = "rgba(30, 27, 75, 0.05)" // Reduced opacity for longer trails
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
}

