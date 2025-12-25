
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Package } from 'lucide-react'
import ChromeBackground from '@/components/noah/ChromeBackground'
import Navigation from '@/components/noah/Navigation'
import SectionLabel from '@/components/noah/SectionLabel'
import ChromeButton from '@/components/noah/ChromeButton'
import { productsApi, analyticsApi, type Product } from '@/lib/api'

export default function Store() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    analyticsApi.trackPageView('/store')
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const data = await productsApi.getAll()
    setProducts(data)
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <ChromeBackground />
      <Navigation />

      <div
        className="fixed inset-0 pointer-events-none z-[5] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Store</SectionLabel>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', lineHeight: '1.1' }}
            >
              Curated Collection
            </h1>
            <p className="text-[#707070] max-w-lg mx-auto leading-relaxed">
              Premium prints, presets, and digital products.
            </p>
          </motion.div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="w-6 h-6 text-[#606060]" />
              </motion.div>
            </div>
          )}

          {!loading && products.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#0A0A0A] border border-[#252525] mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Package className="w-10 h-10 text-[#404040]" />
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-light text-white mb-4"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Coming Soon
              </motion.h2>
              
              <motion.p 
                className="text-[#707070] max-w-md mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                We're carefully curating a collection of premium products. 
                Check back soon for exclusive prints, presets, and digital downloads.
              </motion.p>

              <motion.div
                className="inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="px-6 py-3 text-[10px] tracking-[0.2em] uppercase border border-[#252525] text-[#606060]">
                  Launching Soon
                </div>
              </motion.div>
            </motion.div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    className="relative bg-[#080808] border border-[#151515] overflow-hidden"
                    animate={{ borderColor: hoveredId === product.id ? '#303030' : '#151515' }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#606060] to-transparent z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === product.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="aspect-square overflow-hidden">
                      <motion.img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover filter grayscale"
                        animate={{
                          scale: hoveredId === product.id ? 1.05 : 1,
                          filter: hoveredId === product.id ? 'grayscale(0.5)' : 'grayscale(1)',
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-70" />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm border border-[#303030] text-[#808080]">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-light text-[#E6E6E6] mb-2 group-hover:text-white transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#505050] mb-4 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]">
                        <span className="text-xl font-light text-[#909090]">${product.price}</span>
                        <motion.button
                          className="px-4 py-2 text-[9px] tracking-[0.2em] uppercase border border-[#252525] text-[#606060] hover:border-[#505050] hover:text-[#A0A0A0] transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-20 pt-16 border-t border-[#151515]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-[#505050] mb-6 text-sm">Looking for something custom?</p>
            <ChromeButton variant="ghost">Get in Touch</ChromeButton>
          </motion.div>
        </div>
      </main>
    </div>
  )
}