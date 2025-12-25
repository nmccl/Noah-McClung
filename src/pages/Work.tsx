import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChromeBackground from '../components/noah/ChromeBackground'
import Navigation from '../components/noah/Navigation'
import SectionLabel from '../components/noah/SectionLabel'
import { Code, Palette, Smartphone, Globe, Camera, Package, Loader2, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { projectsApi } from '@/lib/api'

const filters = [
  { key: 'all', label: 'All Work' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'design', label: 'Design' },
  { key: 'photo', label: 'Photography' },
]

const getProjectIcon = (project: any) => {
  const category = project.category?.toLowerCase() || ''
  const title = project.title?.toLowerCase() || ''
  
  if (category.includes('web') || title.includes('web')) return Code
  if (category.includes('mobile') || title.includes('app')) return Smartphone
  if (category.includes('design') || title.includes('design')) return Palette
  if (category.includes('photo') || title.includes('photo')) return Camera
  if (category.includes('e-commerce') || title.includes('store')) return Package
  return Globe
}

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    const data = await projectsApi.getAll()
    setProjects(data)
    setLoading(false)
  }

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true
    return project.category?.toLowerCase().includes(activeFilter)
  })

  const handleProjectClick = (project: any) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
  }

  const closeModal = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedProject?.images && currentImageIndex < selectedProject.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // For photography projects, check if there are multiple images
  const getProjectImages = (project: any) => {
    // If project has an images array, use it
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images
    }
    // Otherwise, use the single image_url
    if (project.image_url) {
      return [project.image_url]
    }
    return []
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Portfolio</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                lineHeight: '1.1'
              }}
            >
              Selected Work
            </h1>
            <p className="text-[#707070] max-w-2xl mx-auto leading-relaxed">
              A collection of projects spanning web development, design, and photography.
              Each piece crafted with attention to detail and purpose.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase border transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-[#808080]/20 border-[#808080] text-white'
                    : 'bg-transparent border-[#252525] text-[#606060] hover:border-[#505050] hover:text-[#909090]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-6 h-6 text-[#606060]" />
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const Icon = getProjectIcon(project)
                const projectImages = getProjectImages(project)
                const isPhotography = project.category?.toLowerCase().includes('photo')
                
                return (
                  <motion.article
                    key={project.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="relative overflow-hidden bg-[#0A0A0A] border border-[#151515] transition-all duration-500"
                      style={{
                        borderColor: hoveredId === project.id ? '#303030' : '#151515'
                      }}
                    >
                      {project.image_url ? (
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <motion.img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover filter grayscale"
                            animate={{
                              scale: hoveredId === project.id ? 1.08 : 1,
                              filter: hoveredId === project.id ? 'grayscale(0.5)' : 'grayscale(1)'
                            }}
                            transition={{ duration: 0.6 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          
                          {/* Image count indicator for photography projects */}
                          {isPhotography && projectImages.length > 1 && (
                            <div className="absolute top-4 right-4 px-2 py-1 text-[9px] tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm border border-[#303030] text-[#909090]">
                              {projectImages.length} Photos
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gradient-to-br from-[#0A0A0A] to-[#151515] flex items-center justify-center">
                          <Icon className="w-16 h-16 text-[#252525]" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-[#303030] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#909090]" />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-[#0A0A0A] border border-[#202020] text-[#606060]">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-[#808080]/10 border border-[#505050] text-[#909090]">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-light text-[#E6E6E6] mb-2 group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="text-sm text-[#505050] mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        
                        {/* Link preview */}
                        {project.link && (
                          <div className="mb-4">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[9px] tracking-wider uppercase text-[#808080] hover:text-[#A0A0A0] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Project
                            </a>
                          </div>
                        )}
                        
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech: string, i: number) => (
                              <span key={i} className="text-[9px] tracking-wider uppercase text-[#404040]">
                                {tech}{i < project.technologies.length - 1 && ' ·'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: hoveredId === project.id ? '100%' : '-100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal for image gallery */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#252525]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-[#303030] flex items-center justify-center hover:border-[#505050] transition-colors"
              >
                <X className="w-5 h-5 text-[#909090]" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image section */}
                <div className="relative md:w-2/3 bg-black">
                  {(() => {
                    const images = getProjectImages(selectedProject)
                    const currentImage = images[currentImageIndex] || selectedProject.image_url
                    
                    return (
                      <>
                        <div className="aspect-square flex items-center justify-center overflow-hidden">
                          <motion.img
                            key={currentImageIndex}
                            src={currentImage}
                            alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain filter grayscale"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        {/* Navigation arrows for multiple images */}
                        {images.length > 1 && (
                          <>
                            {currentImageIndex > 0 && (
                              <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-[#303030] flex items-center justify-center hover:border-[#505050] transition-colors"
                              >
                                <ChevronLeft className="w-5 h-5 text-[#909090]" />
                              </button>
                            )}
                            
                            {currentImageIndex < images.length - 1 && (
                              <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-[#303030] flex items-center justify-center hover:border-[#505050] transition-colors"
                              >
                                <ChevronRight className="w-5 h-5 text-[#909090]" />
                              </button>
                            )}

                            {/* Image counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm border border-[#303030] text-[#909090]">
                              {currentImageIndex + 1} / {images.length}
                            </div>
                          </>
                        )}
                      </>
                    )
                  })()}
                </div>

                {/* Details section */}
                <div className="md:w-1/3 p-8 overflow-y-auto max-h-[80vh]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-[#0A0A0A] border border-[#202020] text-[#606060]">
                      {selectedProject.category}
                    </span>
                    {selectedProject.featured && (
                      <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-[#808080]/10 border border-[#505050] text-[#909090]">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-light text-white mb-4"
                    style={{ 
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontStyle: 'italic',
                    }}
                  >
                    {selectedProject.title}
                  </h2>

                  <p className="text-sm text-[#707070] mb-6 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 text-[10px] tracking-[0.2em] uppercase border border-[#252525] text-[#808080] hover:border-[#505050] hover:text-[#A0A0A0] transition-all duration-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Project
                    </a>
                  )}

                  {selectedProject.technologies?.length > 0 && (
                    <div className="pt-6 border-t border-[#1A1A1A]">
                      <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#606060] mb-3">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech: string, i: number) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 text-[9px] tracking-wider uppercase bg-[#0A0A0A] border border-[#202020] text-[#505050]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}