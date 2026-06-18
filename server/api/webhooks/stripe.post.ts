import {
  orderConfirmationHtml,
  teamNotificationHtml,
  sendEmail,
} from '~/server/utils/email'

// Webhook de Stripe. Escucha checkout.session.completed y dispara el flujo post-pago:
// 1) marca el pedido como pago_confirmado, 2) correo al cliente, 3) aviso al equipo.
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const stripe = getStripe()
  const supabase = getSupabaseAdmin()
  const secret = cfg.stripeWebhookSecret as string

  if (!stripe || !supabase || !secret) {
    setResponseStatus(event, 503)
    return 'Webhook no configurado.'
  }

  const signature = getHeader(event, 'stripe-signature') || ''
  const raw = await readRawBody(event)
  if (!raw) {
    setResponseStatus(event, 400)
    return 'Cuerpo vacío.'
  }

  let stripeEvent
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(raw, signature, secret)
  } catch (err) {
    setResponseStatus(event, 400)
    return `Firma inválida: ${err instanceof Error ? err.message : 'error'}`
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as { metadata?: { orderId?: string }; amount_total?: number }
    const orderId = session.metadata?.orderId
    if (orderId) {
      // 1) Estado del pedido
      await supabase.from('orders').update({ status: 'pago_confirmado' }).eq('id', orderId)

      // Datos para los correos
      const { data: order } = await supabase
        .from('orders')
        .select('total, company_id')
        .eq('id', orderId)
        .single()
      const fmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
      const total = fmt.format(order?.total ?? (session.amount_total ?? 0) / 100)

      let companyName = 'Empresa'
      let companyEmail = ''
      if (order?.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('name, email')
          .eq('id', order.company_id)
          .single()
        companyName = company?.name ?? companyName
        companyEmail = company?.email ?? ''
      }

      // 2) Correo al cliente
      if (companyEmail) {
        await sendEmail({
          to: companyEmail,
          subject: 'Tu pedido está confirmado — Kuki Business',
          html: orderConfirmationHtml(orderId, total),
        })
      }
      // 3) Aviso al equipo
      const teamEmail = cfg.teamEmail as string
      if (teamEmail) {
        await sendEmail({
          to: teamEmail,
          subject: `Nueva orden pagada #${orderId.slice(0, 8)}`,
          html: teamNotificationHtml(orderId, total, companyName),
        })
      }
    }
  }

  return { received: true }
})
