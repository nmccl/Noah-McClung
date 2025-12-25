import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChromeBackground from '@/components/noah/ChromeBackground'
import Navigation from '@/components/noah/Navigation'
import Hero from '@/components/noah/Hero'
import Footer from '@/components/noah/Footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <ChromeBackground />

      {/* Cursor glow effect */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(150,150,150,0.03) 0%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
        animate={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-12 h-px bg-gradient-to-r from-transparent via-[#808080] to-transparent mx-auto mb-4"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#505050]">Loading</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
       {/* Thingy */}
        <div
          className="fixed inset-0 pointer-events-none z-[5] opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        /> 

        <Navigation />
        <Hero />
        <Footer />
      </motion.main>
    </div>
  )
}