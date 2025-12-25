import { motion } from 'framer-motion'

interface ChromeButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  onClick?: () => void
  href?: string
  className?: string
}

export default function ChromeButton({
  children,
  variant = 'primary',
  onClick,
  href,
  className = '',
}: ChromeButtonProps) {
  const baseClasses = `
    relative overflow-hidden px-8 py-3 
    text-sm tracking-[0.2em] uppercase font-light
    transition-all duration-500 ease-out
    border backdrop-blur-sm
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0]
      text-black border-transparent
      hover:from-[#E8E8E8] hover:via-white hover:to-[#E8E8E8]
      hover:shadow-[0_0_30px_rgba(200,200,200,0.3)]
    `,
    ghost: `
      bg-transparent text-[#E6E6E6] border-[#3A3A3A]
      hover:border-[#808080] hover:text-white
      hover:shadow-[0_0_20px_rgba(150,150,150,0.1)]
    `,
  }

  const Component = href ? motion.a : motion.button

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </Component>
  )
}