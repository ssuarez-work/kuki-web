// Tipos del modelo de datos (espejo del esquema en supabase/migrations).

export type OrderStatus =
  | 'pago_pendiente'
  | 'pago_confirmado'
  | 'en_diseno'
  | 'en_produccion'
  | 'enviado'
  | 'entregado'
  | 'cancelado'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pago_pendiente: 'Pago pendiente',
  pago_confirmado: 'Pago confirmado',
  en_diseno: 'En diseño',
  en_produccion: 'En producción',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export interface Company {
  id: string
  user_id: string
  name: string
  rfc?: string | null
  contact_name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  created_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  type: string
  description?: string | null
  image_url?: string | null
  stock: number
  active: boolean
  created_at: string
}

export interface OrderItem {
  type: string
  name: string
  qty: number
  unit_price: number
  sizes?: Record<string, number>
  decoration?: string
}

export interface Order {
  id: string
  company_id: string
  status: OrderStatus
  items: OrderItem[]
  logo_path?: string | null
  subtotal: number
  total: number
  shipping: number
  delivery_method?: string | null
  postal_code?: string | null
  currency: string
  stripe_session_id?: string | null
  created_at: string
}

export interface OrderDelivery {
  method: string
  postalCode: string
  shipping: number
}

export interface Design {
  id: string
  company_id: string
  name: string
  file_path: string
  approved: boolean
  created_at: string
}
