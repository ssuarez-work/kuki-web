import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Cliente Supabase con service role (solo servidor; ignora RLS para webhooks/checkout).
export function getSupabaseAdmin(): SupabaseClient | null {
  const cfg = useRuntimeConfig()
  const url = cfg.public.supabaseUrl as string
  const key = cfg.supabaseServiceKey as string
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

// Instancia de Stripe (solo servidor).
export function getStripe(): Stripe | null {
  const cfg = useRuntimeConfig()
  const key = cfg.stripeSecretKey as string
  if (!key) return null
  return new Stripe(key)
}
