import React from 'react'
import { motion } from 'framer-motion'

interface SectionLabelProps {
  children: React.ReactNode
  align?: 'left' | 'center'
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#808080]" />
      <span className="text-[10px] tracking-[0.4em] uppercase text-[#808080] font-medium">
        {children}
      </span>
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#808080]" />
    </motion.div>
  )
}