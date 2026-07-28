import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isConfigured =
  isValidUrl(rawUrl) &&
  rawKey !== '' &&
  rawKey !== 'your_supabase_anon_key'

const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder.supabase.co'
const supabaseAnonKey = isConfigured ? rawKey : 'placeholder-key'

// Browser client (used in components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured

export default supabase

