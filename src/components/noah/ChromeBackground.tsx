import React, { useRef, useEffect } from 'react'

export default function ChromeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const drawChromeFluid = () => {
      time += 0.003
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create flowing chrome blobs
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * (0.2 + 0.15 * i + Math.sin(time + i * 0.5) * 0.1)
        const y = canvas.height * (0.3 + Math.cos(time * 0.7 + i * 0.8) * 0.2)
        const radius = 150 + Math.sin(time + i) * 50

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, 'rgba(200, 200, 200, 0.08)')
        gradient.addColorStop(0.5, 'rgba(160, 160, 160, 0.04)')
        gradient.addColorStop(1, 'rgba(100, 100, 100, 0)')

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Flowing chrome streams
      for (let j = 0; j < 3; j++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height * (0.3 + j * 0.2))

        for (let x = 0; x <= canvas.width; x += 20) {
          const y =
            canvas.height * (0.3 + j * 0.2) +
            Math.sin(x * 0.003 + time * 2 + j) * 40 +
            Math.sin(x * 0.007 + time + j * 2) * 20
          ctx.lineTo(x, y)
        }

        const streamGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        streamGradient.addColorStop(0, 'rgba(180, 180, 180, 0)')
        streamGradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.03)')
        streamGradient.addColorStop(0.7, 'rgba(180, 180, 180, 0.03)')
        streamGradient.addColorStop(1, 'rgba(160, 160, 160, 0)')

        ctx.strokeStyle = streamGradient
        ctx.lineWidth = 80
        ctx.stroke()
      }

      // Chrome particles
      for (let p = 0; p < 30; p++) {
        const px = ((canvas.width * (p / 30) + time * 50 + p * 100) % canvas.width)
        const py = canvas.height * (0.2 + Math.sin(time + p * 0.3) * 0.3 + (p % 5) * 0.12)
        const size = 1 + Math.sin(time * 2 + p) * 0.5

        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 220, ${0.1 + Math.sin(time + p) * 0.05})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(drawChromeFluid)
    }

    drawChromeFluid()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref__={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}