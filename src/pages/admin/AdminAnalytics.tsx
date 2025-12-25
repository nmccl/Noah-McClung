import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, TrendingUp, Eye, DollarSign, Users, ShoppingBag, FileText } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { analyticsApi } from '@/lib/api'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalRevenue: 0,
    totalPosts: 0,
    totalOrders: 0,
    totalSubscribers: 0,
    unreadMessages: 0,
  })
  const [pageViews, setPageViews] = useState<{ date: string; views: number }[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    const [statsData, viewsData] = await Promise.all([analyticsApi.getStats(), analyticsApi.getPageViews(30)])

    setStats({
      totalViews: statsData.totalViews,
      totalRevenue: statsData.totalRevenue,
      totalPosts: statsData.totalPosts,
      totalOrders: statsData.totalOrders,
      totalSubscribers: statsData.totalSubscribers,
      unreadMessages: statsData.unreadMessages,
    })

    const viewsByDate: Record<string, number> = {}
    viewsData.forEach((v) => {
      viewsByDate[v.date] = (viewsByDate[v.date] || 0) + v.views
    })

    const chartData = Object.entries(viewsByDate)
      .map(([date, views]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views,
      }))
      .slice(-14)

    setPageViews(chartData)
    setLoading(false)
  }

  const statCards = [
    { label: 'Total Page Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#60A5FA' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#34D399' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: '#F97316' },
    { label: 'Blog Posts', value: stats.totalPosts.toString(), icon: FileText, color: '#A78BFA' },
    { label: 'Subscribers', value: stats.totalSubscribers.toString(), icon: Users, color: '#22D3EE' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Analytics</h1>
        <p className="text-[#606060] text-sm">Overview of your site performance</p>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-[#080808] border border-[#151515] p-4 hover:border-[#252525] transition-colors"
            >
              <Icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
              <p className="text-2xl font-light text-white">{stat.value}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#505050] mt-1">{stat.label}</p>
            </div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">Page Views (Last 14 Days)</h2>
          </div>
          {pageViews.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#505050]">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
                <XAxis dataKey="date" stroke="#505050" fontSize={10} tickLine={false} />
                <YAxis stroke="#505050" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0A0A0A',
                    border: '1px solid #252525',
                    borderRadius: 0,
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">Traffic Overview</h2>
          </div>
          {pageViews.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-[#505050]">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202020" />
                <XAxis dataKey="date" stroke="#505050" fontSize={10} tickLine={false} />
                <YAxis stroke="#505050" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0A0A0A',
                    border: '1px solid #252525',
                    borderRadius: 0,
                    color: '#fff',
                  }}
                />
                <Bar dataKey="views" fill="#34D399" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  )
}