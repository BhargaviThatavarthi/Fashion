import { createClient } from '@supabase/supabase-js'

// Sri Subhakari Fashions - Supabase Production Defaults
const DEFAULT_SUPABASE_URL = 'https://kmxsgomxxhwpmoayeqmj.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_0BblhLqDMLI50jSiLg2o8g_yiQ7hVLz'

// In Vite, static property access (import.meta.env.VITE_*) enables compile-time inlining into the browser bundle.
const getClientUrl = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
      const val = String(import.meta.env.VITE_SUPABASE_URL).trim()
      if (val && !val.includes('placeholder')) return val
    }
  } catch {}
  return ''
}

const getClientKey = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const val = String(import.meta.env.VITE_SUPABASE_ANON_KEY).trim()
      if (val && !val.includes('placeholder')) return val
    }
  } catch {}
  return ''
}

const getServerUrl = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = String(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
      if (val && !val.includes('placeholder')) return val
    }
  } catch {}
  return ''
}

const getServerKey = (): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = String(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()
      if (val && !val.includes('placeholder')) return val
    }
  } catch {}
  return ''
}

const rawUrl = getClientUrl() || getServerUrl() || DEFAULT_SUPABASE_URL
const rawKey = getClientKey() || getServerKey() || DEFAULT_SUPABASE_ANON_KEY

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !url.includes('placeholder')
  } catch {
    return false
  }
}

// Supabase configuration verification
const isConfigured =
  isValidUrl(rawUrl) &&
  rawKey !== '' &&
  rawKey !== 'your_supabase_anon_key' &&
  !rawKey.includes('placeholder')

export const supabaseUrl = isConfigured ? rawUrl : DEFAULT_SUPABASE_URL
export const supabaseAnonKey = isConfigured ? rawKey : DEFAULT_SUPABASE_ANON_KEY

// Supabase client instance (used in browser components & server functions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
})

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured

export default supabase

