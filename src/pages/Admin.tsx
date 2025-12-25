import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Image,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Eye,
  DollarSign,
  MessageSquare,
  Loader2,
  Plus,
  ChevronRight,
  Briefcase,
} from 'lucide-react'
import { analyticsApi, blogApi, ordersApi, type BlogPost, type Order } from '@/lib/api'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Blog Posts', path: '/admin/posts' },
  { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
  { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
  { icon: Image, label: 'Media', path: '/admin/media' },
  { icon: Users, label: 'Subscribers', path: '/admin/subscribers' },
  { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Admin() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalRevenue: 0,
    totalPosts: 0,
    totalOrders: 0,
    totalSubscribers: 0,
    unreadMessages: 0,
  })
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  const isExactDashboard = location.pathname === '/admin'

  useEffect(() => {
    if (isExactDashboard) {
      loadDashboardData()
    }
  }, [isExactDashboard])

  const loadDashboardData = async () => {
    setLoading(true)
    const [statsData, postsData, ordersData] = await Promise.all([
      analyticsApi.getStats(),
      blogApi.getAllAdmin(),
      ordersApi.getAll(),
    ])
    setStats({
      totalViews: statsData.totalViews,
      totalRevenue: statsData.totalRevenue,
      totalPosts: statsData.totalPosts,
      totalOrders: statsData.totalOrders,
      totalSubscribers: statsData.totalSubscribers,
      unreadMessages: statsData.unreadMessages,
    })
    setRecentPosts(postsData.slice(0, 5))
    setRecentOrders(ordersData.slice(0, 5))
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const statCards = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-400' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Blog Posts', value: stats.totalPosts.toString(), icon: FileText, color: 'text-purple-400' },
    { label: 'Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-orange-400' },
    { label: 'Subscribers', value: stats.totalSubscribers.toString(), icon: Users, color: 'text-cyan-400' },
    { label: 'Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: 'text-pink-400' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <aside className="hidden md:fixed md:flex left-0 top-0 bottom-0 w-64 bg-[#080808] border-r border-[#151515] flex-col">
          <div className="p-6 border-b border-[#151515]">
            <Link to="/" className="block">
              <span
                className="text-xl text-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                Noah McClung
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-[#505050] mt-1">Admin Dashboard</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                    isActive
                      ? 'bg-[#151515] text-white border-l-2 border-[#808080] -ml-[2px]'
                      : 'text-[#606060] hover:text-white hover:bg-[#0A0A0A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#151515]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full text-[#606060] hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          {isExactDashboard ? (
            <>
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-light text-white mb-2">Dashboard</h1>
                <p className="text-[#606060] text-sm">Welcome back. Here's what's happening.</p>
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
                <>
                  {/* Stats */}
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {statCards.map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div key={stat.label} className="bg-[#080808] border border-[#151515] p-4 hover:border-[#252525] transition-colors">
                          <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                          <p className="text-2xl font-light text-white">{stat.value}</p>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-[#505050] mt-1">{stat.label}</p>
                        </div>
                      )
                    })}
                  </motion.div>

                  {/* Recent content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Posts */}
                    <motion.div
                      className="bg-[#080808] border border-[#151515]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-[#151515]">
                        <h2 className="text-sm font-light text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#606060]" />
                          Recent Posts
                        </h2>
                        <Link
                          to="/admin/posts"
                          className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#606060] hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          New Post
                        </Link>
                      </div>
                      <div className="divide-y divide-[#151515]">
                        {recentPosts.length === 0 ? (
                          <p className="p-4 text-[#505050] text-sm">No posts yet</p>
                        ) : (
                          recentPosts.map((post) => (
                            <div key={post.id} className="p-4 hover:bg-[#0A0A0A] transition-colors">
                              <p className="text-sm text-[#E6E6E6] truncate">{post.title}</p>
                              <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-wider text-[#505050]">
                                <span className={post.published ? 'text-green-500/70' : 'text-yellow-500/70'}>
                                  {post.published ? 'Published' : 'Draft'}
                                </span>
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-4 border-t border-[#151515]">
                        <Link
                          to="/admin/posts"
                          className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#606060] hover:text-white transition-colors"
                        >
                          View All Posts
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div
                      className="bg-[#080808] border border-[#151515]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-[#151515]">
                        <h2 className="text-sm font-light text-white flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#606060]" />
                          Recent Orders
                        </h2>
                      </div>
                      <div className="divide-y divide-[#151515]">
                        {recentOrders.length === 0 ? (
                          <p className="p-4 text-[#505050] text-sm">No orders yet</p>
                        ) : (
                          recentOrders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-[#0A0A0A] transition-colors flex justify-between items-center">
                              <div>
                                <p className="text-sm text-[#E6E6E6]">{order.product?.name || 'Unknown Product'}</p>
                                <p className="text-[10px] uppercase tracking-wider text-[#505050] mt-1">
                                  {order.customer_name || order.customer_email}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-[#909090]">${order.amount}</p>
                                <span
                                  className={`text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                                    order.status === 'delivered'
                                      ? 'bg-green-500/10 text-green-500/80'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-500/10 text-blue-500/80'
                                      : order.status === 'cancelled'
                                      ? 'bg-red-500/10 text-red-500/80'
                                      : 'bg-yellow-500/10 text-yellow-500/80'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}