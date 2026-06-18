export interface VolumeRange {
  min: number
  max: number
  label: string
}

export interface PriceTier extends VolumeRange {
  pricePerUnit: number
}

import { AVAILABLE_COLORS, type GarmentColor } from '~/utils/colors'
import { POLO_SIZES, DRY_FIT_SIZES, CUELLO_SIZES, type SizeGuide } from '~/utils/sizes'

export interface GarmentType {
  id: string
  slug: string
  label: string
  description: string
  image: string
  colors: GarmentColor[]
  sizeGuide: SizeGuide
  tiers: PriceTier[]
}

export const VOLUME_RANGES: VolumeRange[] = [
  { min: 1, max: 5, label: '1 – 5' },
  { min: 6, max: 15, label: '6 – 15 piezas' },
  { min: 16, max: 49, label: '16 – 49 piezas' },
  { min: 50, max: 99, label: '50 – 99 piezas' },
  { min: 100, max: Number.POSITIVE_INFINITY, label: '100+' },
]

function withPrices(prices: number[]): PriceTier[] {
  return VOLUME_RANGES.map((range, index) => ({ ...range, pricePerUnit: prices[index] }))
}

export const GARMENT_TYPES: GarmentType[] = [
  {
    id: 'polo_premium',
    slug: 'polo-premium',
    label: 'Polo Premium',
    description: 'Polo de tejido premium, ideal para uniformes corporativos y personal de cara al cliente.',
    image: '/img/products/polo-corporativo-personalizado.webp',
    colors: AVAILABLE_COLORS,
    sizeGuide: POLO_SIZES,
    tiers: withPrices([350, 290, 270, 250, 230]),
  },
  {
    id: 'dry_fit',
    slug: 'deportiva-dry-fit',
    label: 'Deportiva Dry-Fit',
    description: 'Tela deportiva transpirable de secado rápido, perfecta para equipos y eventos.',
    image: '/img/products/playera-deportiva-dry-fit-personalizada.webp',
    colors: AVAILABLE_COLORS,
    sizeGuide: DRY_FIT_SIZES,
    tiers: withPrices([260, 210, 190, 175, 160]),
  },
  {
    id: 'cuello_redondo',
    slug: 'cuello-redondo',
    label: 'Cuello Redondo',
    description: 'Playera clásica de algodón, cómoda y versátil para todo tu equipo.',
    image: '/img/products/playera-cuello-redondo-personalizada.webp',
    colors: AVAILABLE_COLORS,
    sizeGuide: CUELLO_SIZES,
    tiers: withPrices([200, 150, 135, 120, 110]),
  },
]

export type GarmentTypeId = (typeof GARMENT_TYPES)[number]['id']

export function garmentById(id: string): GarmentType | undefined {
  return GARMENT_TYPES.find((garment) => garment.id === id)
}

export function garmentBySlug(slug: string): GarmentType | undefined {
  return GARMENT_TYPES.find((garment) => garment.slug === slug)
}

export function garmentLabel(id: string): string {
  return garmentById(id)?.label ?? '—'
}

export function garmentImage(id: string): string {
  return garmentById(id)?.image ?? ''
}

export function unitPriceFor(id: string, quantity: number): number | null {
  const garment = garmentById(id)
  if (!garment || quantity < 1) return null
  const tier = garment.tiers.find((t) => quantity >= t.min && quantity <= t.max)
  return tier ? tier.pricePerUnit : null
}

export function priceFrom(id: string): number | null {
  const garment = garmentById(id)
  if (!garment) return null
  return Math.min(...garment.tiers.map((t) => t.pricePerUnit))
}
