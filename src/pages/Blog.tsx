import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ChromeBackground from '../components/noah/ChromeBackground';
import Navigation from '../components/noah/Navigation';
import SectionLabel from '../components/noah/SectionLabel';
import { Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { blogApi } from '../functions/supabaseApi';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Blog() {
  const [hoveredId, setHoveredId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    const data = await blogApi.getAll();
    setPosts(data);
    setLoading(false);
  };
  
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);
  
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Blog</SectionLabel>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6"
              style={{ 
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                lineHeight: '1.1'
              }}
            >
              Thoughts & Process
            </h1>
            <p className="text-[#707070] max-w-lg mx-auto leading-relaxed">
              Writing about development, photography, and the creative process. 
              Insights from the intersection of code and art.
            </p>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-6 h-6 text-[#606060]" />
              </motion.div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400/80 mb-4">{error}</p>
              <button onClick={loadPosts} className="text-[#606060] hover:text-white text-sm">
                Try again
              </button>
            </div>
          )}
          
          {/* Featured posts */}
          {!loading && !error && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <Link key={post.id} to={`/blog/${post.slug || post.id}`}>
                <motion.article
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative overflow-hidden bg-[#0A0A0A] border border-[#1A1A1A]">
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden">
                      <motion.img
                        src={post.image_url || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover filter grayscale"
                        animate={{
                          scale: hoveredId === post.id ? 1.05 : 1,
                          filter: hoveredId === post.id ? 'grayscale(0.5)' : 'grayscale(1)'
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase bg-black/60 backdrop-blur-sm border border-[#303030] text-[#909090]">
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Featured badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase bg-[#808080]/20 backdrop-blur-sm border border-[#505050] text-[#C0C0C0]">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-[10px] tracking-wider uppercase text-[#505050]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at || post.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {post.read_time || post.readTime}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-light text-[#E6E6E6] mb-3 group-hover:text-white transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-[#606060] mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <motion.div
                        className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#707070] group-hover:text-white transition-colors"
                        animate={{ x: hoveredId === post.id ? 4 : 0 }}
                      >
                        Read Article
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                    
                    {/* Chrome shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none"
                      initial={{ x: '-100%' }}
                      animate={{ x: hoveredId === post.id ? '100%' : '-100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>}
          
          {/* Separator */}
          {!loading && !error && <div className="h-px bg-gradient-to-r from-transparent via-[#252525] to-transparent mb-16" />}
          
          {/* Regular posts list */}
          {!loading && !error && <div className="space-y-6">
            {regularPosts.map((post, index) => (
              <Link key={post.id} to={`/blog/${post.slug || post.id}`}>
                <motion.article
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    className="flex flex-col md:flex-row gap-6 p-6 border border-[#151515] bg-[#050505]/50"
                    animate={{
                      borderColor: hoveredId === post.id ? '#303030' : '#151515'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden">
                      <motion.img
                        src={post.image_url || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover filter grayscale"
                        animate={{
                          scale: hoveredId === post.id ? 1.05 : 1
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-2 py-1 text-[8px] tracking-[0.2em] uppercase bg-[#0A0A0A] border border-[#202020] text-[#606060]">
                          {post.category}
                        </span>
                        <span className="text-[10px] tracking-wider uppercase text-[#404040]">
                          {formatDate(post.created_at || post.date)}
                        </span>
                        <span className="text-[10px] tracking-wider uppercase text-[#404040]">
                          {post.read_time || post.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-light text-[#E6E6E6] mb-2 group-hover:text-white transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-[#505050] leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center">
                      <motion.div
                        className="w-10 h-10 rounded-full border border-[#252525] flex items-center justify-center"
                        animate={{
                          borderColor: hoveredId === post.id ? '#606060' : '#252525'
                        }}
                      >
                        <ArrowRight className="w-4 h-4 text-[#505050] group-hover:text-white transition-colors" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.article>
              </Link>
            ))}
          </div>}
        </div>
      </main>
    </div>
  );
}