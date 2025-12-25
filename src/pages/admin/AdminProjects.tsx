import { useState, useEffect, useRef, type DragEvent } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Loader2, Save, X, Star, Upload, Image as ImageIcon } from 'lucide-react'
import { projectsApi, mediaApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectsApi.getAll()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingProject({
      title: '',
      category: '',
      description: '',
      image_url: '',
      images: [],
      technologies: [],
      link: '',
      featured: false,
    })
    setShowEditor(true)
  }

  const handleEdit = (project: any) => {
    setEditingProject({ 
      ...project, 
      images: project.images || [],
      technologies: project.technologies || [],
      link: project.link || ''
    })
    setShowEditor(true)
  }

  const handleSave = async () => {
    // Validate required fields
    if (!editingProject.title?.trim()) {
      toast.error('Title is required')
      return
    }
    if (!editingProject.category?.trim()) {
      toast.error('Category is required')
      return
    }

    setSaving(true)
    try {
      // Clean up the data before saving - only include fields that exist in DB
      const projectData: any = {
        title: editingProject.title.trim(),
        category: editingProject.category.trim(),
        description: editingProject.description?.trim() || '',
        featured: editingProject.featured || false,
      }

      // Only include optional fields if they have values
      if (editingProject.image_url) {
        projectData.image_url = editingProject.image_url
      }
      if (editingProject.images && editingProject.images.length > 0) {
        projectData.images = editingProject.images
      }
      if (editingProject.technologies && editingProject.technologies.length > 0) {
        projectData.technologies = editingProject.technologies
      }
      if (editingProject.link?.trim()) {
        projectData.link = editingProject.link.trim()
      }

      console.log('Saving project:', projectData)

      if (editingProject.id) {
        const result = await projectsApi.update(editingProject.id, projectData)
        console.log('Update result:', result)
        toast.success('Project updated successfully')
      } else {
        const result = await projectsApi.create(projectData)
        console.log('Create result:', result)
        toast.success('Project created successfully')
      }
      
      setShowEditor(false)
      setEditingProject(null)
      await loadProjects()
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    
    try {
      await projectsApi.delete(id)
      toast.success('Project deleted')
      loadProjects()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleTechChange = (value: string) => {
    if (!value.trim()) {
      setEditingProject({ ...editingProject, technologies: [] })
      return
    }
    const techs = value.split(',').map(t => t.trim()).filter(t => t)
    setEditingProject({ ...editingProject, technologies: techs })
  }

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setUploading(true)
    try {
      const result = await mediaApi.upload(file)
      if (result) {
        // Set as main image if no image exists, otherwise add to gallery
        if (!editingProject.image_url) {
          setEditingProject({ ...editingProject, image_url: result.url })
        } else {
          const images = editingProject.images || []
          setEditingProject({ ...editingProject, images: [...images, result.url] })
        }
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

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
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

  const removeImage = (index: number) => {
    const images = [...(editingProject.images || [])]
    images.splice(index, 1)
    setEditingProject({ ...editingProject, images })
  }

  const removeMainImage = () => {
    setEditingProject({ ...editingProject, image_url: '' })
  }

  if (showEditor) {
    const isPhotography = editingProject.category?.toLowerCase().includes('photo')
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light text-white">
            {editingProject.id ? 'Edit Project' : 'New Project'}
          </h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditor(false)} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-white mb-2">Title *</Label>
            <Input
              value={editingProject.title}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              placeholder="Project name"
              className="bg-[#0A0A0A] border-[#252525] text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-2">Category *</Label>
            <Input
              value={editingProject.category}
              onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
              placeholder="Web, Mobile, Design, Photography, Landscape..."
              className="bg-[#0A0A0A] border-[#252525] text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-2">Description</Label>
            <textarea
              value={editingProject.description}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              placeholder="Project description..."
              rows={4}
              className="w-full bg-[#0A0A0A] border border-[#252525] text-white rounded-md p-3"
            />
          </div>

          {/* Drag and Drop Image Upload */}
          <div>
            <Label className="text-white mb-2">Images</Label>
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

            {/* Display uploaded images */}
            <div className="mt-4 space-y-3">
              {editingProject.image_url && (
                <div className="relative bg-[#0A0A0A] border border-[#252525] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={editingProject.image_url} 
                      alt="Main" 
                      className="w-20 h-20 object-cover rounded filter grayscale"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1">Main Image</p>
                      <p className="text-xs text-[#606060] truncate">{editingProject.image_url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeMainImage}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {editingProject.images?.map((imageUrl: string, index: number) => (
                <div key={index} className="relative bg-[#0A0A0A] border border-[#252525] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={imageUrl} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded filter grayscale"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-white mb-1">Gallery Image {index + 1}</p>
                      <p className="text-xs text-[#606060] truncate">{imageUrl}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#505050] mt-2">
              First image will be used as the main thumbnail. Additional images will appear in the gallery.
            </p>
          </div>

          {!isPhotography && (
            <div>
              <Label className="text-white mb-2">Technologies (comma-separated, optional)</Label>
              <Input
                value={editingProject.technologies?.join(', ') || ''}
                onChange={(e) => handleTechChange(e.target.value)}
                placeholder="React, Node.js, Tailwind... (leave empty if not applicable)"
                className="bg-[#0A0A0A] border-[#252525] text-white"
              />
              <p className="text-xs text-[#505050] mt-1">
                Leave empty for photography or other non-technical projects
              </p>
            </div>
          )}

          {isPhotography && (
            <div>
              <Label className="text-white mb-2">Equipment/Tools (comma-separated, optional)</Label>
              <Input
                value={editingProject.technologies?.join(', ') || ''}
                onChange={(e) => handleTechChange(e.target.value)}
                placeholder="Canon EOS R5, Lightroom, Photoshop... (optional)"
                className="bg-[#0A0A0A] border-[#252525] text-white"
              />
              <p className="text-xs text-[#505050] mt-1">
                Optional: List camera equipment or editing software used
              </p>
            </div>
          )}

          <div>
            <Label className="text-white mb-2">Project Link (optional)</Label>
            <Input
              value={editingProject.link}
              onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
              placeholder="https://... (leave empty if not applicable)"
              className="bg-[#0A0A0A] border-[#252525] text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={editingProject.featured}
              onCheckedChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
            />
            <Label className="text-white">Featured</Label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-white">Projects</h2>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-[#080808] border border-[#151515] p-6 hover:border-[#252525] transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {project.image_url && (
                <div className="relative mb-4">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-40 object-cover rounded filter grayscale"
                  />
                  {project.images && project.images.length > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 text-[9px] tracking-wider uppercase bg-black/60 backdrop-blur-sm border border-[#303030] text-[#909090] rounded">
                      +{project.images.length} more
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg text-white">{project.title}</h3>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-0.5 text-[9px] tracking-wider uppercase bg-[#151515] text-[#808080] rounded">
                      {project.category}
                    </span>
  
                  </div>
                  <p className="text-sm text-[#606060] mb-3">{project.description}</p>
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 text-[8px] tracking-wider uppercase bg-[#0A0A0A] text-[#505050] rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-[#151515]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  className="text-[#606060] hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="text-[#606060] hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}