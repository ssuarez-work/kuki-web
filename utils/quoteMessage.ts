import { formatMXN } from '~/utils/currency'

export interface QuoteMessageLine {
  garment: string
  quantity: number
  unitPrice: number
  sizes: string
  decoration: string
}

export interface QuoteMessageDelivery {
  label: string
  postalCode: string
  shipping: number
}

export interface QuoteMessageData {
  lines: QuoteMessageLine[]
  subtotal: number
  tax: number
  total: number
  delivery: QuoteMessageDelivery
  hasLogo: boolean
  depositRate: number
}

export function buildQuoteMessage(data: QuoteMessageData): string {
  const intro = ['Hola, quiero cotizar uniformes:']
  const items = data.lines.flatMap((line, index) => [
    `${index + 1}) ${line.quantity}× ${line.garment} — ${formatMXN(line.unitPrice)} c/u`,
    `   Tallas: ${line.sizes}`,
    `   Personalización: ${line.decoration}`,
  ])
  const deliveryDetail = data.delivery.postalCode
    ? `${data.delivery.label} (C.P. ${data.delivery.postalCode})`
    : data.delivery.label
  const delivery = [`Entrega: ${deliveryDetail}`]
  const totals = [
    `Subtotal: ${formatMXN(data.subtotal)}`,
    `IVA: ${formatMXN(data.tax)}`,
    `Envío: ${data.delivery.shipping > 0 ? formatMXN(data.delivery.shipping) : 'Gratis'}`,
    `Total: ${formatMXN(data.total)}`,
    data.hasLogo
      ? 'Adjunto mi logo o diseño personalizado en este chat.'
      : 'Enviaré mi logo o diseño personalizado en este chat.',
    `Sé que la producción inicia con un anticipo del ${Math.round(data.depositRate * 100)}%.`,
  ]
  return [...intro, '', ...items, '', ...delivery, '', ...totals].join('\n')
}
