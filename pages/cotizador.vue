<template>
  <div class="container-kuki py-12 pb-28 lg:pb-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted" aria-label="Ruta de navegación">
      <NuxtLink to="/" class="transition hover:text-fg">Inicio</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">Cotizador</span>
    </nav>
    <h1 class="text-h1 text-fg">Cotizador de uniformes por volumen</h1>
    <p class="mt-2 max-w-prose text-muted">
      Arma tu pedido: agrega una o varias prendas, define cantidad y tallas, y el precio por pieza se
      ajusta automáticamente según el volumen. Tu logo lo compartes por WhatsApp al confirmar.
    </p>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <div class="flex flex-col gap-4">
        <QuoteLineCard
          v-for="(line, index) in quote.lines.value"
          :key="line.id"
          :line="line"
          :index="index"
          :removable="quote.lines.value.length > 1"
          @remove="quote.removeLine(line.id)"
        />

        <button type="button" class="btn btn-ghost self-start" @click="quote.addLine">
          <i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar otra prenda
        </button>

        <div class="card p-6">
          <label class="mb-2 block text-sm font-medium text-muted">Entrega</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="method in DELIVERY_METHODS"
              :key="method.id"
              type="button"
              class="chip cursor-pointer px-4 py-2 text-sm transition"
              :class="{ 'chip-active': quote.delivery.value.method === method.id }"
              @click="quote.delivery.value.method = method.id"
            >
              {{ method.label }}
            </button>
          </div>
          <div v-if="quote.delivery.value.method === 'nacional'" class="mt-4 sm:max-w-xs">
            <label class="mb-2 block text-sm font-medium text-muted" for="cp">
              Código postal de envío
            </label>
            <input
              id="cp"
              v-model="quote.delivery.value.postalCode"
              inputmode="numeric"
              maxlength="5"
              class="field"
              placeholder="Ej. 97000"
            />
            <p class="mt-2 text-xs text-faint">
              Envío a todo México: {{ formatMXN(NATIONAL_SHIPPING) }} por pedido.
            </p>
          </div>
          <p v-else class="mt-3 text-xs text-faint">
            Coordinamos la entrega en Mérida por WhatsApp, sin costo.
          </p>
        </div>

        <div v-if="portalEnabled" class="card p-6">
          <label class="mb-2 block text-sm font-medium text-muted">Logo de tu empresa</label>
          <label
            class="flex cursor-pointer items-center gap-4 rounded-brand border border-dashed border-line bg-surface px-4 py-5 transition hover:border-ring"
          >
            <div
              v-if="logo.preview.value"
              class="h-16 w-16 shrink-0 overflow-hidden rounded-brand border border-line bg-surface-2"
            >
              <img :src="logo.preview.value" alt="Vista previa del logo" class="h-full w-full object-contain" />
            </div>
            <div v-else class="grid h-16 w-16 shrink-0 place-items-center rounded-brand bg-surface-2 text-2xl text-highlight">
              <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
            </div>
            <div>
              <div class="text-sm font-medium text-fg">
                {{ logo.name.value || 'Arrastra o haz clic para subir' }}
              </div>
              <div class="text-xs text-faint">PNG, SVG o AI · máx. 10 MB</div>
            </div>
            <input type="file" class="hidden" accept=".png,.svg,.ai,image/*" @change="logo.select" />
          </label>
          <p v-if="logo.error.value" class="mt-2 text-xs text-red-400">{{ logo.error.value }}</p>
        </div>

        <div v-else class="card flex items-center gap-4 p-6">
          <div class="grid h-12 w-12 shrink-0 place-items-center rounded-brand bg-surface-2 text-xl text-highlight">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          </div>
          <div>
            <div class="text-sm font-medium text-fg">Tu logo o diseño personalizado</div>
            <div class="text-xs text-muted">
              Adjúntalo directamente en el chat de WhatsApp al enviar tu cotización.
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-20 lg:h-fit">
        <div class="card p-6">
          <h2 class="mb-4 text-h3 text-fg">Resumen</h2>
          <dl class="space-y-3 text-sm text-muted">
            <div class="flex justify-between">
              <dt>Prendas</dt>
              <dd class="font-medium text-fg">{{ quote.lines.value.length }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Subtotal</dt>
              <dd class="font-medium text-fg">{{ formatMXN(quote.subtotal.value) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>IVA (16%)</dt>
              <dd class="font-medium text-fg">{{ formatMXN(quote.tax.value) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Envío</dt>
              <dd class="font-medium text-fg">
                {{ quote.shipping.value > 0 ? formatMXN(quote.shipping.value) : 'Gratis' }}
              </dd>
            </div>
            <div class="flex items-baseline justify-between border-t border-line pt-3">
              <dt class="text-base font-semibold text-fg">Total</dt>
              <dd class="text-xl font-bold text-highlight">{{ formatMXN(quote.total.value) }}</dd>
            </div>
          </dl>
          <button class="btn btn-primary mt-6 w-full" :disabled="!quote.isValid.value || busy" @click="submit">
            {{ busy ? 'Procesando…' : submission.cta }}
          </button>
          <p class="mt-3 text-center text-xs text-faint">
            Más piezas, mejor tarifa. Producción con anticipo del 50%.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="mb-4 text-h2 text-fg">Precios por volumen</h2>
      <div class="card overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="text-muted">
              <th class="px-4 py-3 font-semibold">Cantidad (MXN/pza)</th>
              <th v-for="garment in GARMENT_TYPES" :key="garment.id" class="px-4 py-3 font-semibold">
                {{ garment.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(range, i) in VOLUME_RANGES" :key="range.label" class="border-t border-line">
              <td class="px-4 py-3 font-medium text-fg">{{ range.label }}</td>
              <td v-for="garment in GARMENT_TYPES" :key="garment.id" class="px-4 py-3 text-muted">
                {{ formatMXN(garment.tiers[i].pricePerUnit) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-line lg:hidden"
      style="background: color-mix(in srgb, var(--c-bg) 92%, transparent); backdrop-filter: blur(8px)"
    >
      <div class="container-kuki flex items-center justify-between gap-3 py-3">
        <div>
          <div class="text-xs text-faint">Total</div>
          <div class="text-lg font-bold text-highlight">{{ formatMXN(quote.total.value) }}</div>
        </div>
        <button class="btn btn-primary" :disabled="!quote.isValid.value || busy" @click="submit">
          {{ busy ? '…' : submission.cta }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GARMENT_TYPES, VOLUME_RANGES } from '~/utils/garments'
import { DELIVERY_METHODS } from '~/types/quote'
import { NATIONAL_SHIPPING } from '~/utils/business'

const route = useRoute()
const { public: pub } = useRuntimeConfig()
const site = (pub.siteUrl as string).replace(/\/$/, '')
const portalEnabled = usePortalEnabled()

const quote = useQuote()
const logo = useLogoUpload()
const submission = useQuoteSubmission()
const { gtag } = useGtag()
const busy = ref(false)

useSeo({
  title: 'Cotizador de Uniformes por Volumen en Línea',
  description:
    'Cotiza uniformes y playeras corporativas por volumen en línea. Precio por pieza al instante para Polo Premium, Deportiva Dry-Fit y Cuello Redondo. Calcula tu total y pídelo por WhatsApp.',
  path: '/cotizador',
})

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Cotizador', item: site + '/cotizador' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Cotización de uniformes corporativos por volumen',
    serviceType: 'Personalización de uniformes y playeras corporativas',
    areaServed: 'MX',
    provider: { '@type': 'Organization', name: 'Kuki Business', url: site },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'MXN', lowPrice: 110, highPrice: 350 },
  },
])

onMounted(() => {
  quote.restore()
  const requested = String(route.query.prenda || '')
  const firstLine = quote.lines.value[0]
  if (firstLine && GARMENT_TYPES.some((g) => g.id === requested)) {
    firstLine.garment = requested
  }
})

async function submit() {
  if (!quote.isValid.value || busy.value) return
  gtag('event', 'generate_lead', {
    currency: 'MXN',
    value: quote.total.value,
    items: quote.lines.value.length,
  })
  busy.value = true
  try {
    await submission.submit({
      messageData: quote.toMessageData(!!logo.file.value),
      orderItems: quote.toOrderItems(),
      delivery: {
        method: quote.delivery.value.method,
        postalCode: quote.delivery.value.postalCode,
        shipping: quote.shipping.value,
      },
      logoFile: logo.file.value,
    })
  } catch (e) {
    alert(e instanceof Error ? e.message : 'No se pudo continuar con el pedido.')
  } finally {
    busy.value = false
  }
}
</script>
