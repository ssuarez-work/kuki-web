<template>
  <div class="container-kuki py-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted" aria-label="Ruta de navegación">
      <NuxtLink to="/" class="transition hover:text-fg">Inicio</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">Catálogo</span>
    </nav>

    <h1 class="text-h1 text-fg">Catálogo de uniformes y playeras corporativas</h1>
    <p class="mt-2 max-w-prose text-muted">
      Tres líneas personalizables con tu logo, disponibles en una amplia gama de colores. Cada
      modelo se cotiza por volumen — más piezas, mejor precio.
    </p>

    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CatalogCard v-for="garment in GARMENT_TYPES" :key="garment.id" :garment="garment" />
    </div>

    <div class="mt-10 grid gap-4 sm:grid-cols-3">
      <div v-for="feature in features" :key="feature.title" class="card flex items-start gap-3 p-5">
        <i :class="feature.icon" class="mt-0.5 text-lg text-highlight" aria-hidden="true"></i>
        <div>
          <h2 class="text-sm font-semibold text-fg">{{ feature.title }}</h2>
          <p class="text-sm text-muted">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GARMENT_TYPES, priceFrom } from '~/utils/garments'

const { public: pub } = useRuntimeConfig()
const site = (pub.siteUrl as string).replace(/\/$/, '')

useSeo({
  title: 'Catálogo de Uniformes y Playeras Corporativas',
  description:
    'Catálogo de uniformes corporativos: Polo Premium, Deportiva Dry-Fit y Cuello Redondo personalizables con tu logo, en una amplia gama de colores. Precios por volumen y envíos a todo México.',
  path: '/catalogo',
})

const features = [
  { icon: 'fa-solid fa-palette', title: 'Tu logo estampado', desc: 'Personalizamos cada prenda con el logo de tu empresa.' },
  { icon: 'fa-solid fa-swatchbook', title: 'Amplia gama de colores', desc: 'Múltiples tonos para combinar con tu marca.' },
  { icon: 'fa-solid fa-truck', title: 'Entrega y envíos', desc: 'Entrega personal en Mérida y envíos a todo México.' },
]

useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: site + '/catalogo' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo de uniformes y playeras corporativas',
    itemListElement: GARMENT_TYPES.map((garment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: garment.label,
        description: garment.description,
        image: site + garment.image,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'MXN',
          price: priceFrom(garment.id) ?? 0,
          availability: 'https://schema.org/InStock',
          url: `${site}/cotizador?prenda=${garment.id}`,
        },
      },
    })),
  },
])
</script>
