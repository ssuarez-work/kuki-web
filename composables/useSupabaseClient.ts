import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Cliente Supabase del navegador (singleton). Devuelve null si no está configurado,
// para que el sitio funcione aunque aún no existan las llaves.
let _client: SupabaseClient | null = null

export function useSupabaseClient(): SupabaseClient | null {
  const { public: pub } = useRuntimeConfig()
  const url = pub.supabaseUrl as string
  const key = pub.supabaseAnonKey as string
  if (!url || !key) return null
  if (!_client) {
    _client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  }
  return _client
}

export function isSupabaseConfigured(): boolean {
  const { public: pub } = useRuntimeConfig()
  return !!(pub.supabaseUrl && pub.supabaseAnonKey)
}
