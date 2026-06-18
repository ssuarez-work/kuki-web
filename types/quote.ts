import type { GarmentTypeId } from '~/utils/garments'
import { NATIONAL_SHIPPING } from '~/utils/business'

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = (typeof SIZES)[number]

export const DELIVERY_METHODS = [
  { id: 'merida', label: 'Entrega personal en Mérida', cost: 0 },
  { id: 'nacional', label: 'Envío a todo México', cost: NATIONAL_SHIPPING },
] as const
export type DeliveryMethodId = (typeof DELIVERY_METHODS)[number]['id']

export interface Delivery {
  method: DeliveryMethodId
  postalCode: string
}

export function deliveryLabel(id: DeliveryMethodId): string {
  return DELIVERY_METHODS.find((d) => d.id === id)?.label ?? id
}

export function shippingCost(id: DeliveryMethodId): number {
  return DELIVERY_METHODS.find((d) => d.id === id)?.cost ?? 0
}

export const DECORATIONS = [{ id: 'estampado', label: 'Estampado' }] as const
export type DecorationId = (typeof DECORATIONS)[number]['id']

export interface QuoteLine {
  id: string
  garment: GarmentTypeId
  quantity: number
  sizes: Partial<Record<Size, number>>
  decoration: DecorationId
}

export function decorationLabel(id: DecorationId): string {
  return DECORATIONS.find((d) => d.id === id)?.label ?? id
}

export function formatSizes(sizes: Partial<Record<Size, number>>): string {
  const parts = SIZES.filter((size) => (sizes[size] ?? 0) > 0).map((size) => `${size}:${sizes[size]}`)
  return parts.length ? parts.join(' ') : 'por confirmar'
}
