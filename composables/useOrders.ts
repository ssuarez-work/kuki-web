import type { Order, OrderItem, OrderDelivery } from '~/types/db'
import { IVA_RATE } from '~/utils/business'

// Crear, listar y reordenar pedidos + iniciar checkout de Stripe.
export function useOrders() {
  const client = useSupabaseClient()
  const { company, loadCompany } = useAuth()

  async function ensureCompany() {
    if (!company.value) await loadCompany()
    return company.value
  }

  async function listOrders(): Promise<Order[]> {
    if (!client) return []
    const c = await ensureCompany()
    if (!c) return []
    const { data } = await client
      .from('orders')
      .select('*')
      .eq('company_id', c.id)
      .order('created_at', { ascending: false })
    return (data as Order[]) ?? []
  }

  async function createOrder(
    items: OrderItem[],
    delivery: OrderDelivery,
    logoPath?: string | null,
  ): Promise<Order> {
    if (!client) throw new Error('Supabase no está configurado.')
    const c = await ensureCompany()
    if (!c) throw new Error('No hay empresa asociada a tu cuenta.')
    const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0)
    const total = subtotal * (1 + IVA_RATE) + delivery.shipping
    const { data, error } = await client
      .from('orders')
      .insert({
        company_id: c.id,
        items,
        logo_path: logoPath ?? null,
        subtotal,
        total,
        shipping: delivery.shipping,
        delivery_method: delivery.method,
        postal_code: delivery.postalCode || null,
        status: 'pago_pendiente',
      })
      .select()
      .single()
    if (error) throw error
    return data as Order
  }

  async function reorder(order: Order): Promise<Order> {
    const delivery: OrderDelivery = {
      method: order.delivery_method ?? 'merida',
      postalCode: order.postal_code ?? '',
      shipping: order.shipping ?? 0,
    }
    return createOrder(order.items, delivery, order.logo_path)
  }

  // Pide al servidor la sesión de Stripe y redirige al pago.
  async function startCheckout(orderId: string) {
    const res = await $fetch<{ url?: string; error?: string }>('/api/checkout', {
      method: 'POST',
      body: { orderId },
    })
    if (res.url) window.location.href = res.url
    else throw new Error(res.error || 'No se pudo iniciar el pago.')
  }

  return { listOrders, createOrder, reorder, startCheckout }
}
