import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Loader2, Search, X, Check, XCircle } from 'lucide-react'
import { productsApi, type Product } from '@/lib/api'

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    in_stock: true,
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const data = await productsApi.getAll()
    setProducts(data)
    setLoading(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      image_url: product.image_url || '',
      in_stock: product.in_stock,
    })
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      in_stock: true,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const slug = formData.slug || generateSlug(formData.name)
    const productData = {
      ...formData,
      slug,
      price: parseFloat(formData.price) || 0,
    }

    if (editingProduct) {
      await productsApi.update(editingProduct.id, productData)
    } else {
      await productsApi.create(productData)
    }

    setSaving(false)
    setShowForm(false)
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productsApi.delete(id)
      loadProducts()
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Products</h1>
          <p className="text-[#606060] text-sm">{products.length} total products</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-[#E0E0E0] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505050]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#080808] border border-[#202020] pl-12 pr-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-[#505050]">
          {search ? 'No products match your search' : 'No products yet. Add your first product!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-[#080808] border border-[#151515] overflow-hidden hover:border-[#252525] transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {product.image_url && (
                <img src={product.image_url} alt="" className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-light">{product.name}</h3>
                  <span className="text-lg text-[#909090]">${product.price}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {product.category && (
                    <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 bg-[#151515] text-[#606060]">
                      {product.category}
                    </span>
                  )}
                  <span
                    className={`text-[9px] tracking-wider uppercase px-2 py-0.5 flex items-center gap-1 ${
                      product.in_stock ? 'bg-green-500/10 text-green-500/80' : 'bg-red-500/10 text-red-500/80'
                    }`}
                  >
                    {product.in_stock ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="text-sm text-[#505050] line-clamp-2 mb-3">{product.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-[#505050] hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-[#505050] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-[#0A0A0A] border border-[#202020] w-full max-w-lg max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#202020]">
              <h2 className="text-lg text-white">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#606060] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">
                  Slug (auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder={generateSlug(formData.name)}
                  className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Prints, Digital, etc."
                    className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#080808] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none resize-none"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
                <span className="text-sm text-[#909090]">In Stock</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-[#202020]">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-[#606060] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.price}
                className="px-4 py-2 bg-white text-black text-sm hover:bg-[#E0E0E0] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}