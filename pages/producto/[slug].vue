<template>
  <div class="container-kuki py-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted" aria-label="Ruta de navegación">
      <NuxtLink to="/" class="transition hover:text-fg">Inicio</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <NuxtLink to="/catalogo" class="transition hover:text-fg">Catálogo</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">{{ garment.label }}</span>
    </nav>

    <div class="grid gap-8 lg:grid-cols-2">
      <div class="card overflow-hidden">
        <img
          :src="garment.image"
          :alt="`${garment.label} personalizable con tu logo — Kuki Business`"
          class="aspect-square w-full object-cover"
          width="1080"
          height="1080"
          loading="eager"
          fetchpriority="high"
        />
      </div>

      <div>
        <h1 class="text-h1 text-fg">{{ garment.label }}</h1>
        <p class="mt-2 text-muted">{{ garment.description }}</p>

        <div class="mt-6">
          <div class="mb-2 text-sm font-medium text-muted">
            {{ garment.colors.length }} colores disponibles
          </div>
          <ul class="flex flex-wrap gap-1.5">
            <li
              v-for="color in garment.colors"
              :key="color.name"
              class="h-6 w-6 rounded-full border border-line"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
              :aria-label="color.name"
            ></li>
          </ul>
        </div>

        <div class="card mt-6 p-6">
          <label class="mb-2 block text-sm font-medium text-muted" for="qty">Cantidad de piezas</label>
          <input
            id="qty"
            v-model.number="quantity"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            class="field sm:max-w-xs"
            placeholder="Ej. 45"
          />

          <dl class="mt-5 space-y-2 text-sm text-muted">
            <div class="flex justify-between">
              <dt>Precio por pieza</dt>
              <dd class="font-semibold text-highlight">{{ unitPrice ? formatMXN(unitPrice) : '—' }}</dd>
            </div>
            <div class="flex items-baseline justify-between border-t border-line pt-2">
              <dt class="text-base font-semibold text-fg">Total estimado</dt>
              <dd class="text-xl font-bold text-highlight">{{ total ? formatMXN(total) : '—' }}</dd>
            </div>
          </dl>

          <button class="btn btn-primary mt-5 w-full" :disabled="!total" @click="orderOnWhatsApp">
            <i class="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i> Pedir por WhatsApp
          </button>
          <p class="mt-3 text-center text-xs text-faint">
            Más piezas, mejor tarifa. Producción con anticipo del 50%.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-12 grid gap-8 lg:grid-cols-2">
      <div>
        <h2 class="mb-4 text-h2 text-fg">Precios por volumen</h2>
        <div class="card overflow-hidden">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="text-muted">
                <th class="px-4 py-3 font-semibold">Cantidad</th>
                <th class="px-4 py-3 font-semibold">Precio por pieza</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tier in garment.tiers"
                :key="tier.label"
                class="border-t border-line"
                :style="isActiveTier(tier) ? 'background: color-mix(in srgb, var(--c-primary) 12%, transparent)' : ''"
              >
                <td class="px-4 py-3 font-medium text-fg">{{ tier.label }}</td>
                <td class="px-4 py-3" :class="isActiveTier(tier) ? 'font-bold text-highlight' : 'text-muted'">
                  {{ formatMXN(tier.pricePerUnit) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="mb-4 text-h2 text-fg">Tabla de tallas</h2>
        <div class="card overflow-hidden">
          <table class="w-full border-collapse text-left text-sm">
            <thead>
              <tr class="text-muted">
                <th class="px-4 py-3 font-semibold">Talla</th>
                <th class="px-4 py-3 font-semibold">Pecho (cm)</th>
                <th class="px-4 py-3 font-semibold">Largo (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in garment.sizeGuide.rows" :key="row.size" class="border-t border-line">
                <td class="px-4 py-3 font-medium text-fg">{{ row.size }} <span class="text-faint">/ {{ row.intl }}</span></td>
                <td class="px-4 py-3 text-muted">{{ row.chest }}</td>
                <td class="px-4 py-3 text-muted">{{ row.length }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-xs text-faint">
          Medida del pecho a lo ancho. Tolerancia: largo ±{{ garment.sizeGuide.toleranceLength }} cm ·
          ancho ±{{ garment.sizeGuide.toleranceChest }} cm.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { garmentBySlug, unitPriceFor } from '~/utils/garments'
import type { PriceTier } from '~/utils/garments'

const route = useRoute()
const garment = garmentBySlug(String(route.params.slug))
if (!garment) throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado', fatal: true })

const { public: pub } = useRuntimeConfig()
const site = (pub.siteUrl as string).replace(/\/$/, '')
const { openChat, productQuoteMessage } = useWhatsApp()
const { gtag } = useGtag()

const quantity = ref<number | null>(null)
const unitPrice = computed(() => (quantity.value ? unitPriceFor(garment.id, quantity.value) : null))
const total = computed(() => (unitPrice.value && quantity.value ? unitPrice.value * quantity.value : null))

function isActiveTier(tier: PriceTier) {
  return !!quantity.value && quantity.value >= tier.min && quantity.value <= tier.max
}

function orderOnWhatsApp() {
  if (!total.value || !quantity.value || !unitPrice.value) return
  gtag('event', 'generate_lead', {
    currency: 'MXN',
    value: total.value,
    item_category: garment.id,
    quantity: quantity.value,
  })
  openChat(
    productQuoteMessage({
      garment: garment.label,
      quantity: quantity.value,
      unitPrice: unitPrice.value,
      total: total.value,
    }),
  )
}

useSeo({
  title: `${garment.label} con tu Logo — Precios y Tallas`,
  description: `${garment.description} Cotiza por volumen desde ${formatMXN(Math.min(...garment.tiers.map((t) => t.pricePerUnit)))} por pieza. Personalizable con tu logo, envíos a todo México.`,
  path: `/producto/${garment.slug}`,
  image: garment.image,
})

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: site + '/catalogo' },
      { '@type': 'ListItem', position: 3, name: garment.label, item: `${site}/producto/${garment.slug}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: garment.label,
    description: garment.description,
    image: site + garment.image,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'MXN',
      lowPrice: Math.min(...garment.tiers.map((t) => t.pricePerUnit)),
      highPrice: Math.max(...garment.tiers.map((t) => t.pricePerUnit)),
    },
  },
])
</script>
