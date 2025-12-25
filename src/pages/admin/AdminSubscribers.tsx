import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Loader2, Search, Mail, UserCheck, UserX, Download } from 'lucide-react'
import { subscribersApi, type Subscriber } from '@/lib/api'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadSubscribers()
  }, [])

  const loadSubscribers = async () => {
    setLoading(true)
    const data = await subscribersApi.getAll()
    setSubscribers(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      await subscribersApi.delete(id)
      loadSubscribers()
    }
  }

  const handleToggleSubscription = async (subscriber: Subscriber) => {
    await subscribersApi.toggleSubscription(subscriber.id, !subscriber.subscribed)
    loadSubscribers()
  }

  const handleExport = () => {
    const activeSubscribers = subscribers.filter((s) => s.subscribed)
    const csv = ['Email,Name,Subscribed Date']
      .concat(activeSubscribers.map((s) => `${s.email},${s.name || ''},${formatDate(s.created_at)}`))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.email.toLowerCase().includes(search.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = subscribers.filter((s) => s.subscribed).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Subscribers</h1>
          <p className="text-[#606060] text-sm">
            {activeCount} active of {subscribers.length} total
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={activeCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[#151515] text-white text-sm hover:bg-[#252525] transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505050]" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#080808] border border-[#202020] pl-12 pr-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="w-12 h-12 text-[#303030] mx-auto mb-4" />
          <p className="text-[#505050]">{search ? 'No subscribers match your search' : 'No subscribers yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSubscribers.map((subscriber) => (
            <motion.div
              key={subscriber.id}
              className="bg-[#080808] border border-[#151515] p-4 hover:border-[#252525] transition-colors flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    subscriber.subscribed ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  {subscriber.subscribed ? (
                    <UserCheck className="w-5 h-5 text-green-500/80" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-500/80" />
                  )}
                </div>
                <div>
                  <p className="text-white">{subscriber.email}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-wider text-[#505050]">
                    {subscriber.name && <span>{subscriber.name}</span>}
                    <span>Joined {formatDate(subscriber.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSubscription(subscriber)}
                  className={`px-3 py-1 text-[10px] tracking-wider uppercase transition-colors ${
                    subscriber.subscribed
                      ? 'text-yellow-500/80 hover:text-yellow-400'
                      : 'text-green-500/80 hover:text-green-400'
                  }`}
                >
                  {subscriber.subscribed ? 'Unsubscribe' : 'Resubscribe'}
                </button>
                <button
                  onClick={() => handleDelete(subscriber.id)}
                  className="p-2 text-[#505050] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}