import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, Loader2, Copy, Check, Image as ImageIcon, File } from 'lucide-react'
import { mediaApi, type Media } from '@/lib/api'

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    const data = await mediaApi.getAll()
    setMedia(data)
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    for (const file of Array.from(files)) {
      await mediaApi.upload(file)
    }
    setUploading(false)
    loadMedia()

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (item: Media) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await mediaApi.delete(item.id, item.filename)
      loadMedia()
    }
  }

  const handleCopyUrl = async (item: Media) => {
    await navigator.clipboard.writeText(item.url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const isImage = (type: string) => type?.startsWith('image/')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Media Library</h1>
          <p className="text-[#606060] text-sm">{media.length} files</p>
        </div>
        <div>
          <input
            ref__={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-[#E0E0E0] transition-colors cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-12 h-12 text-[#303030] mx-auto mb-4" />
          <p className="text-[#505050]">No media uploaded yet</p>
          <p className="text-[#404040] text-sm mt-1">Upload images, videos, or documents</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <motion.div
              key={item.id}
              className="bg-[#080808] border border-[#151515] overflow-hidden hover:border-[#252525] transition-colors group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="aspect-square relative bg-[#050505]">
                {isImage(item.type) ? (
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <File className="w-12 h-12 text-[#303030]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-white/10 hover:bg-red-500/50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-[#909090] truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] uppercase tracking-wider text-[#505050]">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}