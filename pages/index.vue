<template>
  <div>
    <!-- Hero -->
    <header class="container-kuki pt-12 sm:pt-16 lg:pt-20">
      <div class="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <h1 class="text-display text-fg">
            Uniformes corporativos
            <span class="text-highlight">personalizados</span>
          </h1>
          <p class="mt-5 max-w-prose text-lead text-muted">
            Playeras, polos y prendas con el logo de tu empresa. Cotiza por volumen en segundos y
            haz tu pedido por WhatsApp. Calidad premium, entrega personal en Mérida y envíos a todo
            México.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink to="/cotizador" class="btn btn-primary">Cotizar por volumen</NuxtLink>
            <NuxtLink to="/catalogo" class="btn btn-ghost">Ver catálogo</NuxtLink>
          </div>
        </div>

        <!-- Imagen de producto -->
        <div class="card overflow-hidden">
          <img
            src="/img/products/polo-corporativo-personalizado.webp"
            alt="Polo corporativo personalizado con estampado del logo de empresa — Kuki Business"
            class="aspect-square w-full object-cover"
            width="1080"
            height="1080"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      </div>
    </header>

    <section class="container-kuki py-16 sm:py-20">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-h2 text-fg">Nuestros productos</h2>
          <p class="mt-1 text-muted">
            Tres líneas personalizables con tu logo, en una amplia gama de colores.
          </p>
        </div>
        <NuxtLink to="/catalogo" class="btn btn-ghost hidden shrink-0 sm:inline-flex">
          Ver catálogo
        </NuxtLink>
      </div>
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CatalogCard v-for="garment in GARMENT_TYPES" :key="garment.id" :garment="garment" />
      </div>
      <NuxtLink to="/catalogo" class="btn btn-ghost mt-6 w-full sm:hidden">Ver catálogo</NuxtLink>
    </section>

    <!-- Beneficios -->
    <section class="container-kuki py-16 sm:py-20">
      <h2 class="text-h2 text-fg">¿Por qué Kuki Business para tu empresa?</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="b in benefits" :key="b.title" class="card card-hover p-6">
          <div class="grid h-11 w-11 place-items-center rounded-brand bg-surface-2 text-lg text-highlight">
            <i :class="b.icon" aria-hidden="true"></i>
          </div>
          <h3 class="mt-3 text-h3 text-fg">{{ b.title }}</h3>
          <p class="mt-1 text-sm text-muted">{{ b.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="container-kuki pb-16 sm:pb-20">
      <h2 class="text-h2 text-fg">Cómo funciona</h2>
      <div class="mt-8 grid gap-4 md:grid-cols-4">
        <div v-for="(s, i) in steps" :key="s.title" class="card p-6">
          <div class="text-sm font-semibold text-highlight">0{{ i + 1 }}</div>
          <h3 class="mt-2 text-h3 text-fg">{{ s.title }}</h3>
          <p class="mt-1 text-sm text-muted">{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Preguntas frecuentes (SEO: FAQPage) -->
    <section class="container-kuki pb-16 sm:pb-20">
      <h2 class="text-h2 text-fg">Preguntas frecuentes sobre uniformes corporativos</h2>
      <div class="mt-8 grid gap-3">
        <details v-for="f in faqs" :key="f.q" class="card group p-5">
          <summary class="flex cursor-pointer items-center justify-between gap-4 font-semibold text-fg">
            {{ f.q }}
            <i class="fa-solid fa-chevron-down text-sm text-muted transition group-open:rotate-180" aria-hidden="true"></i>
          </summary>
          <p class="mt-3 text-sm text-muted">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- CTA final -->
    <section class="container-kuki pb-20">
      <div class="card flex flex-col items-center gap-5 p-10 text-center sm:p-14">
        <h2 class="text-h1 text-fg">¿Listos para vestir a tu equipo?</h2>
        <p class="max-w-prose text-muted">
          Cotiza en minutos y haz tu pedido por WhatsApp. Sin mínimos imposibles.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/cotizador" class="btn btn-primary">Empezar cotización</NuxtLink>
          <NuxtLink v-if="portalEnabled" to="/login" class="btn btn-ghost">Entrar al portal B2B</NuxtLink>
          <NuxtLink v-else to="/catalogo" class="btn btn-ghost">Ver catálogo</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { GARMENT_TYPES } from '~/utils/garments'

const { public: pub } = useRuntimeConfig()
const site = (pub.siteUrl as string).replace(/\/$/, '')
const portalEnabled = usePortalEnabled()

useSeo({
  title: 'Uniformes y Playeras Personalizadas en Mérida',
  description:
    'Uniformes y playeras corporativas personalizadas con tu logo en Mérida, Yucatán. Cotiza por volumen: polos, deportivas dry-fit y cuello redondo desde $110/pza. Entrega local y envíos a todo México.',
  path: '/',
  type: 'website',
})

const faqs = [
  {
    q: '¿Cuál es la cantidad mínima de uniformes?',
    a: 'Trabajamos desde 1 pieza (muestra) y los mejores precios se obtienen por volumen: a partir de 6, 16, 50 y 100+ piezas la tarifa por pieza baja.',
  },
  {
    q: '¿Cómo personalizo las playeras con mi logo?',
    a: 'Nos compartes tu logotipo (PNG, SVG o AI) por WhatsApp y lo estampamos en cada prenda.',
  },
  {
    q: '¿Qué tipos de prenda manejan?',
    a: 'Polo Premium, Deportiva Dry-Fit y Cuello Redondo, en tallas para todo tu equipo y con personalización de tu marca.',
  },
  {
    q: '¿Cómo recibo mi pedido?',
    a: 'En Mérida hacemos entrega personal sin costo, coordinada por WhatsApp. Al resto de México enviamos por paquetería con número de rastreo y una tarifa fija de envío por pedido.',
  },
  {
    q: '¿Puedo reordenar los mismos uniformes después?',
    a: 'Sí. Guardamos tu logo y los detalles de tu pedido, así que repetirlo es muy rápido: escríbenos por WhatsApp y lo reproducimos igual.',
  },
]

// Datos estructurados (schema.org): Organización, Sitio web y FAQ.
useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kuki Business',
    url: site,
    logo: `${site}/img/logo.webp`,
    description:
      'Fabricación de uniformes y playeras corporativas personalizadas con estampado de logo. Cotización por volumen, entrega personal en Mérida y envíos a todo México.',
    areaServed: 'MX',
    telephone: '+529999985969',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mérida',
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'ventas',
      telephone: '+529999985969',
      availableLanguage: ['es'],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kuki Business',
    url: site,
    inLanguage: 'es-MX',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
])

const benefits = [
  { icon: 'fa-solid fa-shirt', title: 'Calidad premium', desc: 'Telas resistentes al uso diario y al lavado constante.' },
  { icon: 'fa-solid fa-tags', title: 'Precio por volumen', desc: 'Mientras más piezas, mejor tarifa. Cotización transparente.' },
  { icon: 'fa-solid fa-palette', title: 'Tu marca, tu logo', desc: 'Estampado de tu logotipo en cada prenda.' },
  { icon: 'fa-solid fa-truck', title: 'Entrega y envíos', desc: 'Entrega personal en Mérida y envíos a todo México con rastreo.' },
]

const steps = [
  { title: 'Cotiza', desc: 'Elige tipo de prenda y cantidad; el precio se calcula al instante.' },
  { title: 'Escríbenos', desc: 'Haz tu pedido por WhatsApp y mándanos tu logo (PNG, SVG o AI).' },
  { title: 'Producimos', desc: 'Confirmas tu pedido y anticipo, y entra a producción.' },
  { title: 'Recíbelo', desc: 'Entrega personal en Mérida o envío con rastreo a todo México.' },
]
</script>
