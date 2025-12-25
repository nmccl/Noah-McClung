import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

// Base navigation items
const baseNavItems = [
  { name: 'Home', page: 'Home' },
  { name: 'Work', page: 'Work' },
  { name: 'Store', page: 'Store' },
  { name: 'Blog', page: 'Blog' },
  { name: 'About', page: 'About' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navItems, setNavItems] = useState(baseNavItems)

  const { user, loading } = useAuth()

  // Update navigation items when auth state changes
  useEffect(() => {
    if (!loading) {
      // Admin check via Supabase user email
      const isAdmin = user?.email === 'nmcclung9@gmail.com' // <- Change to your admin email
      
      // Debug logging
      console.log('Auth state updated:', { 
        userEmail: user?.email, 
        isAdmin, 
        loading 
      })
      
      if (isAdmin) {
        setNavItems([...baseNavItems, { name: 'Admin', page: 'Admin' }])
      } else {
        setNavItems(baseNavItems)
      }
    }
  }, [user, loading])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate responsive spacing based on number of items
  const itemCount = navItems.length
  const getItemSpacing = () => {
    if (itemCount <= 5) {
      return 'py-3 md:py-4' // More spacing for 5 or fewer items
    }
    return 'py-2 md:py-3' // Tighter spacing for 6 items
  }

  const getTextSize = () => {
    if (itemCount <= 5) {
      return 'text-3xl md:text-4xl lg:text-5xl' // Larger text for 5 or fewer items
    }
    return 'text-2xl md:text-3xl lg:text-4xl' // Smaller text for 6 items
  }

  return (
    <>
      {/* Fixed nav trigger */}
      <motion.button
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[60] w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center gap-1.5 group"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.span
          className="w-6 h-px bg-[#808080] group-hover:bg-white transition-colors"
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0, width: isOpen ? 20 : 24 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-px bg-[#808080] group-hover:bg-white transition-colors"
          animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 10 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-6 h-px bg-[#808080] group-hover:bg-white transition-colors"
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0, width: isOpen ? 20 : 24 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Small page indicator when scrolled */}
      <AnimatePresence>
        {scrolled && !isOpen && (
          <motion.div
            className="fixed top-6 left-6 md:top-8 md:left-8 z-[60]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={createPageUrl('Home')}
              className="text-sm md:text-base text-[#606060] hover:text-white transition-colors"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              NM
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full screen navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Chrome accent lines */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#252525] to-transparent" />
            <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#252525] to-transparent" />

            <nav className="text-center w-full max-w-2xl">
              {navItems.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    to={createPageUrl(item.page)}
                    className={`block ${getItemSpacing()} group`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-[#404040] block mb-1">
                      0{index + 1}
                    </span>

                    <div className="relative inline-block">
                      <span
                        className={`${getTextSize()} font-light text-[#606060] group-hover:text-white transition-all duration-500`}
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
                      >
                        {item.name}
                      </span>
                      
                      {/* Underline container - positioned absolutely to prevent layout shift */}
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-full flex justify-center pointer-events-none">
                        <motion.div 
                          className="h-px bg-gradient-to-r from-transparent via-[#808080] to-transparent"
                          initial={{ width: 0 }}
                          whileHover={{ width: itemCount <= 5 ? 96 : 80 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer info */}
            <motion.div
              className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 text-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#353535]">
                Noah McClung · Developer & Photographer
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}