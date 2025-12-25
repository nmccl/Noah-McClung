
import { motion } from 'framer-motion';
import ChromeBackground from '../components/noah/ChromeBackground';
import Navigation from '../components/noah/Navigation';
import SectionLabel from '../components/noah/SectionLabel';
import ChromeButton from '../components/noah/ChromeButton';
import PfP from '../assets/IMG_0415.jpg'

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/nmccl' },
  { name: 'Instagram', href: 'https://www.instagram.com/imnoahmcclung' }
];

export default function About() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <ChromeBackground />
      <Navigation />
      
      {/* Noise overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[5] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>About</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                lineHeight: '1.1'
              }}
            >
              The Story
            </h1>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Portrait */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="relative sticky top-32">
                {/* Matte frame */}
                <div className="relative bg-[#0A0A0A] p-4 border border-[#151515]">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={PfP}
                      alt="Noah McClung"
                      className="w-full h-full object-cover filter grayscale contrast-110"
                    />
                    {/* Studio lighting vignette */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(ellipse at 30% 30%, transparent 30%, rgba(0,0,0,0.5) 100%)'
                      }}
                    />
                  </div>
                  
                  {/* Frame shadow */}
                  <div className="absolute -bottom-3 left-6 right-6 h-6 bg-black/30 blur-lg" />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -right-4 top-1/2 w-8 h-px bg-gradient-to-r from-[#404040] to-transparent" />
                <div className="absolute -left-4 top-1/3 w-8 h-px bg-gradient-to-l from-[#404040] to-transparent" />
                
                {/* Social links */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="text-xs text-[#505050] hover:text-white transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Bio content */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Cursive quote */}
              <p 
                className="text-3xl md:text-4xl text-[#505050] mb-10 leading-relaxed"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic'
                }}
              >
                "Precision in code,<br />poetry in light"
              </p>
              
              <h1 className="text-4xl md:text-5xl font-light text-white mb-10 leading-tight"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  lineHeight: '1.15'
                }}
              >
                Noah McClung
              </h1>
              
              {/* Bio text */}
              <div className="space-y-6 text-[#909090] leading-relaxed">
                <p>
                  I’m a student developer focused on software and web development.
                </p>
                <p>
                 I started programming at 15 and quickly realized it was more than a hobby. I replaced video games with development because I loved the challenge and the creativity behind building something from nothing. Seeing ideas turn into real, working products is what keeps me passionate about this field.
                </p>
                <p>
                  The intersection of technology and art has always fascinated me. Code 
                  is poetry with logic, photography is painting with light—both require 
                  precision, patience, determination, and an eye for detail.
                </p>
                <p className="text-[#606060]">
                 Outside of coding, I heavily enjoy photography, content creation, writing, and playing piano.
                </p>
              </div>
              
              {/* Separator */}
              <div className="my-12 h-px bg-gradient-to-r from-[#252525] via-[#353535] to-transparent" />
              
              {/* Stats 
              <div className="grid grid-cols-3 gap-8 mb-12">
                {[
                  { value: '1+', label: 'Years Experience' },
                  { value: '20+', label: 'Projects Delivered' },
                  { value: '∞', label: 'Frames Captured' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <p className="text-3xl font-light text-white mb-2">{stat.value}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#505050]">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div> */}
              
              {/* Skills/Focus areas */}
              <div className="mb-12">
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#404040] mb-6">
                  Focus Areas
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['React', 'Node.js', 'Python', 'TypeScript', 'UI/UX', 'Swift', 'SwiftUI', 'HTML', 'CSS', 'Photography', 'Art Direction'].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 text-[10px] tracking-wider uppercase text-[#606060] border border-[#1A1A1A] rounded-sm bg-[#080808]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
               {/* <ChromeButton variant="primary">Download Resume</ChromeButton> */}
                <ChromeButton variant="ghost">Get in Touch</ChromeButton>
              </div>
            </motion.div>
          </div>
          
          {/* Footer section */}
          <motion.div
            className="mt-32 pt-16 border-t border-[#151515] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#353535] mb-4">
              Let's create something together
            </p>
            <a 
              href="mailto:contact@noahmcclung.com"
              className="text-lg text-[#707070] hover:text-white transition-colors duration-300"
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic'
              }}
            >
              contact@noahmcclung.com
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}