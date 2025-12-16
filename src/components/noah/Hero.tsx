import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ChromeButton from './ChromeButton'
import { createPageUrl } from '@/lib/utils'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Chrome accent lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent opacity-30" />
      <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#404040] to-transparent opacity-20" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Elegant pre-title */}
        <motion.p
          className="text-[10px] tracking-[0.5em] uppercase text-[#808080] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Developer · Photographer · Creator
        </motion.p>

        {/* Main name */}
        <motion.h1
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="block text-5xl md:text-7xl lg:text-8xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E0E0E0] to-[#909090] pb-2"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
              lineHeight: '1.15',
            }}
          >
            Noah McClung
          </span>
          {/* Chrome shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-[#A0A0A0] font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Crafting digital experiences through code and capturing moments through the lens.
          <br />
          <span className="text-[#707070]">Where engineering meets artistry.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Link to={createPageUrl('Work')}>
            <ChromeButton variant="primary">View Work</ChromeButton>
          </Link>
          <Link to={createPageUrl('Store')}>
            <ChromeButton variant="ghost">Visit Store</ChromeButton>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-[#606060] to-transparent mx-auto"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#505050] mt-3">Scroll</p>
      </motion.div>
    </section>
  )
}