import { IVA_RATE } from '~/utils/business'

export default defineEventHandler(async (event) => {
  const { orderId } = await readBody<{ orderId?: string }>(event)
  if (!orderId) return { error: 'Falta orderId.' }

  const stripe = getStripe()
  const supabase = getSupabaseAdmin()
  if (!stripe || !supabase) return { error: 'Pagos no configurados (Stripe/Supabase).' }

  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (error || !order) return { error: 'Pedido no encontrado.' }

  const site = (useRuntimeConfig().public.siteUrl as string).replace(/\/$/, '')
  const currency = (order.currency || 'MXN').toLowerCase()
  const items = order.items as Array<{ name: string; qty: number; unit_price: number }>
  const subtotalCents = items.reduce((sum, i) => sum + i.qty * Math.round(i.unit_price * 100), 0)
  const shippingCents = Math.round((order.shipping ?? 0) * 100)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      ...items.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency,
          product_data: { name: i.name },
          unit_amount: Math.round(i.unit_price * 100),
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency,
          product_data: { name: 'IVA (16%)' },
          unit_amount: Math.round(subtotalCents * IVA_RATE),
        },
      },
      ...(shippingCents > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency,
                product_data: { name: 'Envío nacional' },
                unit_amount: shippingCents,
              },
            },
          ]
        : []),
    ],
    success_url: `${site}/portal/pedidos?pago=ok`,
    cancel_url: `${site}/portal/pedidos?pago=cancelado`,
    metadata: { orderId: order.id },
  })

  await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id)

  return { url: session.url }
})
