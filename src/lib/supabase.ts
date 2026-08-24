import { createClient } from '@supabase/supabase-js'

const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return String(import.meta.env[key]).trim()
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]).trim()
  }
  return ''
}

const rawUrl = getEnv('VITE_SUPABASE_URL')
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY')

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !url.includes('placeholder')
  } catch {
    return false
  }
}

// Check if valid Supabase configuration is present in environment
const isConfigured =
  isValidUrl(rawUrl) &&
  rawKey !== '' &&
  rawKey !== 'your_supabase_anon_key' &&
  !rawKey.includes('placeholder')

export const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder.supabase.co'
export const supabaseAnonKey = isConfigured ? rawKey : 'placeholder-key'

// Supabase client (used in browser components & server functions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured

export default supabase
