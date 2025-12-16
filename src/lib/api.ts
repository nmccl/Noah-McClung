// api.ts
import { supabase } from './supabase'

// Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  image_url: string
  read_time: string
  featured: boolean
  published: boolean
  views: number
  created_at: string
  updated_at: string
}
export interface Product {
  id: string
  slug: string
  description: string
  price: number
  category: string
  image_url: string
  in_stock: boolean
  created_at: string
}
export interface Project {
  id: string
  title: string
  slug: string
  description: string
  category: 'dev' | 'photo'
  type: string
  tech_stack: string[]
  location: string
  image_url: string
  link: string
  featured: boolean
  created_at: string
}
export interface Order {
  id: string
  customer_email: string
  customer_name: string
  product_id: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  product?: Product
}
export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}
export interface Subscriber {
  id: string
  email: string
  name: string
  subscribed: boolean
  created_at: string
}
export interface Media {
  id: string
  filename: string
  url: string
  type: string
  size: number
  created_at: string
}
export interface SiteSetting {
  id: string
  key: string
  value: any
  updated_at: string
}

// ---------- BLOG (only section updated) ----------
export const blogApi = {
  async getAll(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('blogApi.getAll error:', error)
        return []
      }
      return (data as BlogPost[]) || []
    } catch (err) {
      console.error('blogApi.getAll exception:', err)
      return []
    }
  },

  async getAllAdmin(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('blogApi.getAllAdmin error:', error)
        return []
      }
      return (data as BlogPost[]) || []
    } catch (err) {
      console.error('blogApi.getAllAdmin exception:', err)
      return []
    }
  },

  async getBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const bySlug = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()

      if (bySlug.error) {
        console.warn('blogApi.getBySlug slug query error:', bySlug.error)
      }
      if (bySlug.data) return bySlug.data as BlogPost

      const byId = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slug)
        .eq('published', true)
        .maybeSingle()

      if (byId.error) {
        console.warn('blogApi.getBySlug id query error:', byId.error)
        return null
      }
      return (byId.data as BlogPost) || null
    } catch (err) {
      console.error('blogApi.getBySlug exception:', err)
      return null
    }
  },

  async create(post: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single()

      if (error) {
        console.error('blogApi.create error:', error)
        return null
      }
      return data as BlogPost
    } catch (err) {
      console.error('blogApi.create exception:', err)
      return null
    }
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('blogApi.update error:', error)
        return null
      }
      return data as BlogPost
    } catch (err) {
      console.error('blogApi.update exception:', err)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) {
        console.error('blogApi.delete error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('blogApi.delete exception:', err)
      return false
    }
  },

  async incrementViews(id: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('views')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        console.warn('blogApi.incrementViews select error:', error)
        return
      }
      const current = (data?.views as number) || 0
      const { error: updateErr } = await supabase
        .from('blog_posts')
        .update({ views: current + 1 })
        .eq('id', id)
      if (updateErr) console.warn('blogApi.incrementViews update error:', updateErr)
    } catch (err) {
      console.error('blogApi.incrementViews exception:', err)
    }
  }
}

// ---------- PRODUCTS ----------
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (error) {
        console.error('productsApi.getAll error:', error)
        return []
      }
      return data as Product[]
    } catch (err) {
      console.error('productsApi.getAll exception:', err)
      return []
    }
  },
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
      if (error) {
        console.error('productsApi.getBySlug error:', error)
        return null
      }
      return data as Product | null
    } catch (err) {
      console.error('productsApi.getBySlug exception:', err)
      return null
    }
  },
  create: async (product: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.from('products').insert(product).select().single()
      if (error) {
        console.error('productsApi.create error:', error)
        return null
      }
      return data as Product
    } catch (err) {
      console.error('productsApi.create exception:', err)
      return null
    }
  },
  update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
      if (error) {
        console.error('productsApi.update error:', error)
        return null
      }
      return data as Product
    } catch (err) {
      console.error('productsApi.update exception:', err)
      return null
    }
  },
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        console.error('productsApi.delete error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('productsApi.delete exception:', err)
      return false
    }
  }
}

// ---------- PROJECTS ----------
export const projectsApi = {
  getAll: async (category?: string): Promise<Project[]> => {
    try {
      let q: any = supabase.from('projects').select('*').order('created_at', { ascending: false })
      if (category) q = q.eq('category', category)
      const { data, error } = await q
      if (error) {
        console.error('projectsApi.getAll error:', error)
        return []
      }
      return data as Project[]
    } catch (err) {
      console.error('projectsApi.getAll exception:', err)
      return []
    }
  },
  getBySlug: async (slug: string): Promise<Project | null> => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle()
      if (error) {
        console.error('projectsApi.getBySlug error:', error)
        return null
      }
      return data as Project | null
    } catch (err) {
      console.error('projectsApi.getBySlug exception:', err)
      return null
    }
  },
  create: async (project: Partial<Project>): Promise<Project | null> => {
    try {
      const { data, error } = await supabase.from('projects').insert(project).select().single()
      if (error) {
        console.error('projectsApi.create error:', error)
        return null
      }
      return data as Project
    } catch (err) {
      console.error('projectsApi.create exception:', err)
      return null
    }
  }
}

// ---------- ORDERS ----------
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('ordersApi.getAll error:', error)
        return []
      }
      return data as Order[]
    } catch (err) {
      console.error('ordersApi.getAll exception:', err)
      return []
    }
  },
  create: async (order: Partial<Order>): Promise<Order | null> => {
    try {
      const { data, error } = await supabase.from('orders').insert(order).select().single()
      if (error) {
        console.error('ordersApi.create error:', error)
        return null
      }
      return data as Order
    } catch (err) {
      console.error('ordersApi.create exception:', err)
      return null
    }
  },
  updateStatus: async (id: string, status: Order['status']): Promise<Order | null> => {
    try {
      const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single()
      if (error) {
        console.error('ordersApi.updateStatus error:', error)
        return null
      }
      return data as Order
    } catch (err) {
      console.error('ordersApi.updateStatus exception:', err)
      return null
    }
  },
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) {
        console.error('ordersApi.delete error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('ordersApi.delete exception:', err)
      return false
    }
  }
}

// ---------- CONTACT ----------
export const contactApi = {
  getAll: async (): Promise<ContactMessage[]> => {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*')
      if (error) {
        console.error('contactApi.getAll error:', error)
        return []
      }
      return data as ContactMessage[]
    } catch (err) {
      console.error('contactApi.getAll exception:', err)
      return []
    }
  },
  create: async (msg: Partial<ContactMessage>): Promise<ContactMessage | null> => {
    try {
      const { data, error } = await supabase.from('contact_messages').insert(msg).select().single()
      if (error) {
        console.error('contactApi.create error:', error)
        return null
      }
      return data as ContactMessage
    } catch (err) {
      console.error('contactApi.create exception:', err)
      return null
    }
  },
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('contact_messages').update({ read: true }).eq('id', id)
      if (error) {
        console.error('contactApi.markAsRead error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('contactApi.markAsRead exception:', err)
      return false
    }
  },
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id)
      if (error) {
        console.error('contactApi.delete error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('contactApi.delete exception:', err)
      return false
    }
  }
}

// ---------- SUBSCRIBERS ----------
export const subscribersApi = {
  getAll: async (): Promise<Subscriber[]> => {
    try {
      const { data, error } = await supabase.from('subscribers').select('*')
      if (error) {
        console.error('subscribersApi.getAll error:', error)
        return []
      }
      return data as Subscriber[]
    } catch (err) {
      console.error('subscribersApi.getAll exception:', err)
      return []
    }
  },
  create: async (email: string, name?: string): Promise<Subscriber | null> => {
    try {
      const { data, error } = await supabase.from('subscribers').insert({ email, name }).select().single()
      if (error) {
        console.error('subscribersApi.create error:', error)
        return null
      }
      return data as Subscriber
    } catch (err) {
      console.error('subscribersApi.create exception:', err)
      return null
    }
  },
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('subscribers').delete().eq('id', id)
      if (error) {
        console.error('subscribersApi.delete error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('subscribersApi.delete exception:', err)
      return false
    }
  },
  toggleSubscription: async (id: string, subscribed: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase.from('subscribers').update({ subscribed }).eq('id', id)
      if (error) {
        console.error('subscribersApi.toggleSubscription error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('subscribersApi.toggleSubscription exception:', err)
      return false
    }
  }
}

// ---------- MEDIA ----------
export const mediaApi = {
  getAll: async (): Promise<Media[]> => {
    try {
      const { data, error } = await supabase.from('media').select('*')
      if (error) {
        console.error('mediaApi.getAll error:', error)
        return []
      }
      return data as Media[]
    } catch (err) {
      console.error('mediaApi.getAll exception:', err)
      return []
    }
  },
  upload: async (file: File): Promise<{ filename: string; url: string } | null> => {
    try {
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
      const { error: uploadError } = await supabase.storage.from('media').upload(filename, file)
      if (uploadError) {
        console.error('mediaApi.upload storage error:', uploadError)
        return null
      }
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filename)
      return { filename, url: urlData.publicUrl }
    } catch (err) {
      console.error('mediaApi.upload exception:', err)
      return null
    }
  },
  delete: async (id: string, filename: string): Promise<boolean> => {
    try {
      const { error: removeError } = await supabase.storage.from('media').remove([filename])
      if (removeError) {
        console.error('mediaApi.delete storage remove error:', removeError)
        return false
      }
      const { error } = await supabase.from('media').delete().eq('id', id)
      if (error) {
        console.error('mediaApi.delete db error:', error)
        return false
      }
      return true
    } catch (err) {
      console.error('mediaApi.delete exception:', err)
      return false
    }
  }
}

// ---------- SETTINGS ----------
export const settingsApi = {
  getAll: async (): Promise<SiteSetting[]> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').order('key')
      if (error) {
        console.error('settingsApi.getAll error:', error)
        return []
      }
      return data as SiteSetting[]
    } catch (err) {
      console.error('settingsApi.getAll exception:', err)
      return []
    }
  },
  get: async (key: string): Promise<any> => {
    try {
      const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
      if (error) {
        console.error('settingsApi.get error:', error)
        return null
      }
      return data?.value
    } catch (err) {
      console.error('settingsApi.get exception:', err)
      return null
    }
  },
  update: async (key: string, value: any): Promise<SiteSetting | null> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select()
        .single()
      if (error) {
        console.error('settingsApi.update error:', error)
        return null
      }
      return data as SiteSetting
    } catch (err) {
      console.error('settingsApi.update exception:', err)
      return null
    }
  }
}

// ---------- ANALYTICS ----------
export const analyticsApi = {
  async trackPageView(page: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const find = await supabase
        .from('analytics')
        .select('id, views')
        .eq('page', page)
        .eq('date', today)
        .maybeSingle()

      if (find.error) {
        console.warn('analytics.trackPageView find error:', find.error)
      }

      if (find.data) {
        const { error: updateErr } = await supabase
          .from('analytics')
          .update({ views: (find.data.views || 0) + 1 })
          .eq('id', find.data.id)
        if (updateErr) console.warn('analytics.trackPageView update error:', updateErr)
      } else {
        const { error: insertErr } = await supabase.from('analytics').insert({ page, date: today, views: 1 })
        if (insertErr) console.warn('analytics.trackPageView insert error:', insertErr)
      }
    } catch (err) {
      console.error('analytics.trackPageView exception:', err)
    }
  },

  async getStats(): Promise<{
    totalViews: number
    totalRevenue: number
    totalPosts: number
    totalProducts: number
    totalOrders: number
    totalSubscribers: number
    unreadMessages: number
  }> {
    try {
      const [analyticsRes, postsRes, productsRes, ordersRes, subscribersRes, messagesRes] = await Promise.all([
        supabase.from('analytics').select('views'),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('amount, status'),
        supabase.from('subscribers').select('id', { count: 'exact' }).eq('subscribed', true),
        supabase.from('contact_messages').select('id', { count: 'exact' }).eq('read', false)
      ])

      const totalViews = (analyticsRes.data || []).reduce((sum: number, a: any) => sum + (a.views || 0), 0)
      const totalRevenue = (ordersRes.data || [])
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + Number(o.amount || 0), 0)

      return {
        totalViews,
        totalRevenue,
        totalPosts: postsRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalSubscribers: subscribersRes.count || 0,
        unreadMessages: messagesRes.count || 0
      }
    } catch (err) {
      console.error('analytics.getStats error:', err)
      return {
        totalViews: 0,
        totalRevenue: 0,
        totalPosts: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSubscribers: 0,
        unreadMessages: 0
      }
    }
  },

  async getPageViews(days: number = 30): Promise<{ date: string; views: number }[]> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const { data, error } = await supabase
        .from('analytics')
        .select('date, views')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true })
      if (error) {
        console.error('analytics.getPageViews error:', error)
        return []
      }
      return data || []
    } catch (err) {
      console.error('analytics.getPageViews exception:', err)
      return []
    }
  }
}
