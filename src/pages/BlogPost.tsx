import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Eye, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ChromeBackground from '../components/noah/ChromeBackground';
import Navigation from '../components/noah/Navigation';
import { blogApi, analyticsApi } from '../functions/supabaseApi';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Route param id:', id);
    if (id) {
      loadPost(id);
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [id]);

  const loadPost = async (postId) => {
    console.log('Loading post:', postId);
    setLoading(true);
    setError('');
    
    try {
      const data = await blogApi.getBySlug(postId);
      console.log('Post data:', data);
      
      if (data) {
        setPost(data);
        // Increment views and track page view
        await Promise.all([
          blogApi.incrementViews(data.id),
          analyticsApi.trackPageView(`/blog/${postId}`)
        ]);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-6 h-6 text-[#606060]" />
        </motion.div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ChromeBackground />
        <Navigation />
        <div className="relative z-10 pt-32 pb-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-light text-white mb-4">Post Not Found</h1>
            <p className="text-[#606060] mb-8">{error || 'The blog post youre looking for doesnt exist.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#808080] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ChromeBackground />
      <Navigation />

      <div
        className="fixed inset-0 pointer-events-none z-[5] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <article className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#606060] hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] tracking-[0.2em] uppercase">Back to Blog</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {post.category && (
              <span className="inline-block px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase bg-[#151515] border border-[#252525] text-[#808080] mb-6">
                {post.category}
              </span>
            )}
            
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[11px] tracking-wider uppercase text-[#505050]">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.created_at)}
              </span>
              {post.read_time && (
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {post.read_time}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                {post.views || 0} views
              </span>
            </div>
          </motion.header>

          {/* Featured Image */}
          {post.image_url && (
            <motion.div
              className="mb-12 -mx-6 md:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#0A0A0A] border border-[#1A1A1A]">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              className="text-xl text-[#909090] leading-relaxed mb-12 pb-12 border-b border-[#1A1A1A]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            className="prose prose-invert prose-lg max-w-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-light text-white mt-12 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-light text-white mt-10 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-light text-[#E6E6E6] mt-8 mb-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[#909090] leading-relaxed mb-6">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-[#909090]">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-[#909090]">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-[#909090] leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#404040] pl-6 my-8 italic text-[#808080]">
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="px-2 py-1 bg-[#151515] text-[#C0C0C0] text-sm rounded">{children}</code>
                  ) : (
                    <pre className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 overflow-x-auto mb-6">
                      <code className="text-[#909090] text-sm">{children}</code>
                    </pre>
                  ),
                a: ({ href, children }) => (
                  <a
                    href__={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 hover:text-[#C0C0C0] transition-colors"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <figure className="my-8">
                    <img src={src} alt={alt} className="w-full rounded border border-[#1A1A1A]" />
                    {alt && <figcaption className="text-center text-sm text-[#505050] mt-3">{alt}</figcaption>}
                  </figure>
                ),
                hr: () => <hr className="border-[#252525] my-12" />,
              }}
            >
              {post.content || ''}
            </ReactMarkdown>
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="mt-16 pt-8 border-t border-[#1A1A1A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#606060] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] tracking-[0.2em] uppercase">Back to all posts</span>
            </Link>
          </motion.footer>
        </div>
      </article>
    </div>
  );
}