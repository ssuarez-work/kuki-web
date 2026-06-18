import { GARMENT_TYPES, garmentLabel, unitPriceFor, type GarmentTypeId } from '~/utils/garments'
import { DEPOSIT_RATE, IVA_RATE } from '~/utils/business'
import {
  SIZES,
  decorationLabel,
  deliveryLabel,
  formatSizes,
  shippingCost,
  type Delivery,
  type QuoteLine,
} from '~/types/quote'
import type { QuoteMessageData } from '~/utils/quoteMessage'
import type { OrderItem } from '~/types/db'

const STORAGE_KEY = 'kuki-quote'
const POSTAL_CODE_PATTERN = /^\d{5}$/

function createLine(garment: GarmentTypeId = GARMENT_TYPES[0].id): QuoteLine {
  return { id: crypto.randomUUID(), garment, quantity: 0, sizes: {}, decoration: 'estampado' }
}

function createDelivery(): Delivery {
  return { method: 'merida', postalCode: '' }
}

export function useQuote() {
  const lines = useState<QuoteLine[]>('quote-lines', () => [createLine()])
  const delivery = useState<Delivery>('quote-delivery', createDelivery)

  const lineUnitPrice = (line: QuoteLine) => unitPriceFor(line.garment, line.quantity)
  const lineTotal = (line: QuoteLine) => {
    const unit = lineUnitPrice(line)
    return unit && line.quantity > 0 ? unit * line.quantity : 0
  }
  const sizesCount = (line: QuoteLine) => SIZES.reduce((sum, size) => sum + (line.sizes[size] ?? 0), 0)
  const sizesMismatch = (line: QuoteLine) => sizesCount(line) > 0 && sizesCount(line) !== line.quantity

  const subtotal = computed(() => lines.value.reduce((sum, line) => sum + lineTotal(line), 0))
  const tax = computed(() => subtotal.value * IVA_RATE)
  const shipping = computed(() => shippingCost(delivery.value.method))
  const total = computed(() => subtotal.value + tax.value + shipping.value)
  const deliveryValid = computed(
    () => delivery.value.method !== 'nacional' || POSTAL_CODE_PATTERN.test(delivery.value.postalCode),
  )
  const isValid = computed(
    () => subtotal.value > 0 && lines.value.every((line) => line.quantity >= 1) && deliveryValid.value,
  )

  function addLine() {
    lines.value.push(createLine())
  }

  function removeLine(id: string) {
    lines.value = lines.value.filter((line) => line.id !== id)
    if (lines.value.length === 0) lines.value.push(createLine())
  }

  function toMessageData(hasLogo: boolean): QuoteMessageData {
    return {
      lines: lines.value.map((line) => ({
        garment: garmentLabel(line.garment),
        quantity: line.quantity,
        unitPrice: lineUnitPrice(line) ?? 0,
        sizes: formatSizes(line.sizes),
        decoration: decorationLabel(line.decoration),
      })),
      subtotal: subtotal.value,
      tax: tax.value,
      total: total.value,
      delivery: {
        label: deliveryLabel(delivery.value.method),
        postalCode: delivery.value.postalCode,
        shipping: shipping.value,
      },
      hasLogo,
      depositRate: DEPOSIT_RATE,
    }
  }

  function toOrderItems(): OrderItem[] {
    return lines.value.map((line) => ({
      type: line.garment,
      name: garmentLabel(line.garment),
      qty: line.quantity,
      unit_price: lineUnitPrice(line) ?? 0,
      sizes: line.sizes as Record<string, number>,
      decoration: line.decoration,
    }))
  }

  function restore() {
    if (!import.meta.client) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed?.lines) && parsed.lines.length) lines.value = parsed.lines
      if (parsed?.delivery) delivery.value = parsed.delivery
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (import.meta.client) {
    watch(
      [lines, delivery],
      () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: lines.value, delivery: delivery.value })),
      { deep: true },
    )
  }

  return {
    lines,
    delivery,
    subtotal,
    tax,
    shipping,
    total,
    isValid,
    lineUnitPrice,
    lineTotal,
    sizesCount,
    sizesMismatch,
    garmentLabel,
    addLine,
    removeLine,
    toMessageData,
    toOrderItems,
    restore,
  }
}
