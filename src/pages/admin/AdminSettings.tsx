import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Save, Globe, Mail, User, FileText } from 'lucide-react'
import { settingsApi } from '@/lib/api'

interface SiteSettings {
  site_name: string
  site_description: string
  contact_email: string
  social_twitter: string
  social_instagram: string
  social_github: string
  social_linkedin: string
  about_text: string
  footer_text: string
}

const defaultSettings: SiteSettings = {
  site_name: 'Noah McClung',
  site_description: 'Developer & Photographer',
  contact_email: '',
  social_twitter: '',
  social_instagram: '',
  social_github: '',
  social_linkedin: '',
  about_text: '',
  footer_text: '',
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const data = await settingsApi.get('site_settings')
    if (data) {
      setSettings({ ...defaultSettings, ...data })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await settingsApi.set('site_settings', settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-6 h-6 text-[#606060] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
          <p className="text-[#606060] text-sm">Configure your site settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm hover:bg-[#E0E0E0] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <span className="text-green-600">✓ Saved</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">
                Site Description
              </label>
              <input
                type="text"
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">Contact</h2>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
            />
          </div>
        </motion.div>

        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">Social Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Twitter / X</label>
              <input
                type="text"
                value={settings.social_twitter}
                onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                placeholder="https://twitter.com/username"
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Instagram</label>
              <input
                type="text"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                placeholder="https://instagram.com/username"
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">GitHub</label>
              <input
                type="text"
                value={settings.social_github}
                onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">LinkedIn</label>
              <input
                type="text"
                value={settings.social_linkedin}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-[#080808] border border-[#151515] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-4 h-4 text-[#606060]" />
            <h2 className="text-sm font-light text-white">Content</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">About Text</label>
              <textarea
                value={settings.about_text}
                onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
                rows={4}
                placeholder="A brief description about yourself..."
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#505050] mb-2">Footer Text</label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                placeholder="© 2024 Your Name. All rights reserved."
                className="w-full bg-[#0A0A0A] border border-[#202020] px-4 py-3 text-white text-sm focus:border-[#404040] focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}