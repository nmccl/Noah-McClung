import React from 'react'
import { motion } from 'framer-motion'

const socialLinks = [
  { name: 'GitHub', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative py-20 px-6">
      {/* Top line separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#252525] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Logo/Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3
              className="text-2xl text-white mb-4"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
              }}
            >
              Noah McClung
            </h3>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#505050]">
              Developer · Photographer
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            className="md:text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#404040] mb-4">Connect</p>
            <div className="flex flex-wrap gap-6 md:justify-center">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href__={link.href}
                  className="text-xs text-[#606060] hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#404040] mb-4">Inquiries</p>
            <a
              href__="mailto:contact@noahmcclung.com"
              className="text-sm text-[#808080] hover:text-white transition-colors duration-300"
            >
              contact@noahnmcclung.com
            </a>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          className="mt-5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#353535]">
            © {new Date().getFullYear()} Made by Noah McClung. All rights reserved.
          </p>

          {/* Micro chrome accent */}
         { /* <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-[#404040]" />
            <div className="w-6 h-px bg-gradient-to-r from-[#404040] to-[#252525]" />
            <div className="w-1 h-1 rounded-full bg-[#303030]" />
          </div> */}

          <p className="text-[10px] tracking-[0.2em] uppercase text-[#353535]">
            Crafted with intention
          </p>
        </motion.div>
      </div>
    </footer>
  )
}