import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Save, X, Upload, Image as ImageIcon } from 'lucide-react'
import { blogApi, mediaApi } from '@/lib/api'
import RichTextEditor from './RichTextEditor.tsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category: string
  read_time: string
  published: boolean
  featured: boolean
  created_at?: string
  views?: number
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const data: BlogPost[] = await blogApi.getAllAdmin()
    setPosts(data)
    setLoading(false)
  }

  const handleNew = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: 'Development',
      read_time: '5 min read',
      published: false,
      featured: false
    })
    setShowEditor(true)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post })
    setShowEditor(true)
  }

  const handleSave = async () => {
    if (!editingPost) return

    try {
      if (!editingPost.slug) {
        editingPost.slug = editingPost.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      }

      if (editingPost.id) {
        await blogApi.update(editingPost.id, editingPost)
        toast.success('Post updated successfully')
      } else {
        await blogApi.create(editingPost)
        toast.success('Post created successfully')
      }

      setShowEditor(false)
      setEditingPost(null)
      loadPosts()
    } catch (error) {
      toast.error('Failed to save post')
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await blogApi.delete(id)
      toast.success('Post deleted')
      loadPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      await blogApi.update(post.id!, { published: !post.published })
      toast.success(post.published ? 'Post unpublished' : 'Post published')
      loadPosts()
    } catch (error) {
      toast.error('Failed to update post')
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setUploading(true)
    try {
      const result = await mediaApi.upload(file)
      if (result && editingPost) {
        setEditingPost({ ...editingPost, image_url: result.url })
        toast.success('Image uploaded successfully')
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload error')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    if (editingPost) {
      setEditingPost({ ...editingPost, image_url: '' })
    }
  }

  if (showEditor && editingPost) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-white">
            {editingPost.id ? 'Edit Post' : 'New Post'}
          </h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Post
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label className="text-white mb-2">Title</Label>
            <Input
              value={editingPost.title}
              onChange={(e) =>
                setEditingPost({ ...editingPost, title: e.target.value })
              }
              placeholder="Post title"
              className="bg-[#0A0A0A] border-[#252525] text-white"
            />
          </div>

          {/* Slug */}
          <div>
            <Label className="text-white mb-2">Slug (URL)</Label>
            <Input
              value={editingPost.slug}
              onChange={(e) =>
                setEditingPost({ ...editingPost, slug: e.target.value })
              }
              placeholder="post-url-slug"
              className="bg-[#0A0A0A] border-[#252525] text-white"
            />
          </div>

          {/* Drag and Drop Image Upload */}
          <div>
            <Label className="text-white mb-2">Featured Image</Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive 
                  ? 'border-[#808080] bg-[#151515]' 
                  : 'border-[#252525] bg-[#0A0A0A] hover:border-[#404040]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <div className="text-center">
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#606060] animate-spin" />
                    <p className="text-sm text-[#606060]">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[#404040] mx-auto mb-4" />
                    <p className="text-sm text-[#808080] mb-2">
                      Drag and drop an image here, or click to browse
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Display uploaded image */}
            {editingPost.image_url && (
              <div className="mt-4">
                <div className="relative bg-[#0A0A0A] border border-[#252525] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={editingPost.image_url} 
                      alt="Featured" 
                      className="w-20 h-20 object-cover rounded filter grayscale"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1">Featured Image</p>
                      <p className="text-xs text-[#606060] truncate">{editingPost.image_url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category & Read Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2">Category</Label>
              <Input
                value={editingPost.category}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, category: e.target.value })
                }
                placeholder="Development"
                className="bg-[#0A0A0A] border-[#252525] text-white"
              />
            </div>

            <div>
              <Label className="text-white mb-2">Read Time</Label>
              <Input
                value={editingPost.read_time}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, read_time: e.target.value })
                }
                placeholder="5 min read"
                className="bg-[#0A0A0A] border-[#252525] text-white"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label className="text-white mb-2">Excerpt</Label>
            <textarea
              value={editingPost.excerpt}
              onChange={(e) =>
                setEditingPost({ ...editingPost, excerpt: e.target.value })
              }
              placeholder="Brief description..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-[#252525] text-white rounded-md p-3"
            />
          </div>

          {/* Content */}
          <div>
            <Label className="text-white mb-2">Content (Markdown)</Label>
            <RichTextEditor
              value={editingPost.content}
              onChange={(content: string) =>
                setEditingPost({ ...editingPost, content })
              }
            />
          </div>

          {/* Settings */}
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <Switch
                checked={editingPost.published}
                onCheckedChange={(checked) =>
                  setEditingPost({ ...editingPost, published: checked })
                }
              />
              <Label className="text-white">Published</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editingPost.featured}
                onCheckedChange={(checked) =>
                  setEditingPost({ ...editingPost, featured: checked })
                }
              />
              <Label className="text-white">Featured</Label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-white">Blog Posts</h2>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-[#080808] border border-[#151515] p-6 hover:border-[#252525] transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-white">{post.title}</h3>

                    {post.published ? (
                      <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-green-500/10 text-green-500/80 rounded">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-yellow-500/10 text-yellow-500/80 rounded">
                        Draft
                      </span>
                    )}

                    {post.featured && (
                      <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-purple-500/10 text-purple-500/80 rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#606060] mb-3">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-[#505050]">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{formatDate(post.created_at || '')}</span>
                    <span>•</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePublished(post)}
                    className="text-[#606060] hover:text-white"
                  >
                    {post.published ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(post)}
                    className="text-[#606060] hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id!)}
                    className="text-[#606060] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}