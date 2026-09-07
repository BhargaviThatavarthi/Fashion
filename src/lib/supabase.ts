import { createClient } from '@supabase/supabase-js'

// Sri Subhakari Fashions - Supabase Production Instance (Hardened Direct Configuration)
export const supabaseUrl = 'https://kmxsgomxxhwpmoayeqmj.supabase.co'
export const supabaseAnonKey = 'sb_publishable_0BblhLqDMLI50jSiLg2o8g_yiQ7hVLz'

// Supabase client instance (used in browser components & server functions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  },
})

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => true

export default supabase
