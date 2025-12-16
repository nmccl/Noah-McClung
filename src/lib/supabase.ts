import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// HMR / multiple-initialization safe: attach to globalThis
declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE_CLIENT__: SupabaseClient | undefined
}

const getClient = (): SupabaseClient => {
  if (globalThis.__SUPABASE_CLIENT__) return globalThis.__SUPABASE_CLIENT__
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // keep storage key default, but you can customize it
      persistSession: true,
      // Optionally set localStorage key to avoid collisions
      // storageKey: 'sb:user'
    }
  })
  globalThis.__SUPABASE_CLIENT__ = client
  return client
}

export const supabase = getClient()