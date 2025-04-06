"use client"

import { useEffect, useRef } from "react"

export default function AnimatedSphere() {
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

    // Create particles for the sphere
    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      distance: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 8 + 2 // Larger particles
        this.density = Math.random() * 30 + 1
        this.distance = 0

        // Create a gradient of purples and blues
        const hue = Math.random() * 60 + 240 // 240-300 is blue to purple
        const saturation = Math.random() * 30 + 70 // 70-100%
        const lightness = Math.random() * 30 + 60 // 60-90%
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.random() * 0.3 + 0.1})` // More transparent
      }

      draw() {
        if (!ctx) return
        ctx.filter = "blur(4px)" // Add blur effect to each particle
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.filter = "none" // Reset filter
      }

      update(mouseX: number, mouseY: number) {
        // Calculate distance from mouse
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        this.distance = distance

        // Create interactive force
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const maxDistance = 100
        const force = (maxDistance - distance) / maxDistance

        // If within influence range, move particle
        if (distance < maxDistance) {
          this.x -= forceDirectionX * force * this.density
          this.y -= forceDirectionY * force * this.density
        } else {
          // Return to original position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx / 10
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy / 10
          }
        }
      }
    }

    // Create a sphere of particles
    const particlesArray: Particle[] = []
    const numberOfParticles = 800 // Increased from 500
    const radius = Math.min(canvas.width, canvas.height) * 0.3
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < numberOfParticles; i++) {
      // Create particles across the entire canvas with higher density in the center
      let x, y

      if (Math.random() < 0.7) {
        // 70% of particles in a sphere shape in the center
        const angle = Math.random() * Math.PI * 2
        const theta = Math.random() * Math.PI * 2
        const r = radius * Math.cbrt(Math.random()) // Cube root for uniform distribution

        x = centerX + r * Math.sin(angle) * Math.cos(theta)
        y = centerY + r * Math.sin(angle) * Math.sin(theta)
      } else {
        // 30% of particles randomly across the entire canvas
        x = Math.random() * canvas.width
        y = Math.random() * canvas.height
      }

      particlesArray.push(new Particle(x, y))
    }

    // Mouse position
    let mouseX = 0
    let mouseY = 0

    window.addEventListener("mousemove", (e) => {
      mouseX = e.x
      mouseY = e.y
    })

    // Animation loop
    const animate = () => {
      if (!ctx) return

      // Clear canvas with a slight trail effect
      ctx.fillStyle = "rgba(30, 27, 75, 0.05)" // Indigo-950 with low opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouseX, mouseY)
        particlesArray[i].draw()

        // Connect particles with lines
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 50) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(180, 160, 255, ${0.2 - distance / 250})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }
      }

      // Apply additional canvas-wide blur for a dreamy effect
      ctx.filter = "blur(8px)"
      ctx.globalAlpha = 0.3
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw()
      }
      ctx.filter = "none"
      ctx.globalAlpha = 1.0

      // Apply radial blur effect
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, "rgba(30, 27, 75, 0)")
      gradient.addColorStop(1, "rgba(30, 27, 75, 0.8)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
}

