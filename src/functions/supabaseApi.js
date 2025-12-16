import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Blog Posts API
export const blogApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching posts:', error)
      return []
    }
    return data || []
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching admin posts:', error)
      return []
    }
    return data || []
  },

  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) {
      // Try by ID as fallback
      const { data: byId, error: idError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slug)
        .eq('published', true)
        .single()
      
      if (idError) {
        console.error('Error fetching post:', idError)
        return null
      }
      return byId
    }
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching post by ID:', error)
      return null
    }
    return data
  },

  async create(post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating post:', error)
      throw error
    }
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating post:', error)
      throw error
    }
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }
    return true
  },

  async incrementViews(id) {
    const { error } = await supabase.rpc('increment_views', { post_id: id })
    
    if (error) {
      console.error('Error incrementing views:', error)
    }
  }
}

// Products API
export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching product:', error)
      return null
    }
    return data
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      throw error
    }
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating product:', error)
      throw error
    }
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }
    return true
  }
}

// Orders API
export const ordersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }
    return data || []
  },

  async create(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating order:', error)
      throw error
    }
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating order:', error)
      throw error
    }
    return data
  }
}

// Contact/Subscribers API
export const contactApi = {
  async subscribe(email) {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select()
      .single()
    
    if (error) {
      console.error('Error subscribing:', error)
      throw error
    }
    return data
  },

  async getSubscribers() {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching subscribers:', error)
      return []
    }
    return data || []
  }
}

// Analytics API
export const analyticsApi = {
  async getStats() {
    const [postsResult, ordersResult, subscribersResult] = await Promise.all([
      supabase.from('blog_posts').select('views', { count: 'exact' }),
      supabase.from('orders').select('amount, status', { count: 'exact' }),
      supabase.from('subscribers').select('*', { count: 'exact' })
    ])

    const totalViews = postsResult.data?.reduce((sum, post) => sum + (post.views || 0), 0) || 0
    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
    const totalPosts = postsResult.count || 0
    const totalOrders = ordersResult.count || 0
    const totalSubscribers = subscribersResult.count || 0

    return {
      totalViews,
      totalRevenue,
      totalPosts,
      totalOrders,
      totalSubscribers,
      unreadMessages: 0
    }
  },

  async trackPageView(page) {
    const { error } = await supabase
      .from('page_views')
      .insert([{ page }])
    
    if (error) {
      console.error('Error tracking page view:', error)
    }
  }
}

export const projectsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(project) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}