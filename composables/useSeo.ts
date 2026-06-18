// Helper SEO: setea title/description, Open Graph, Twitter Card, canonical y og:url
// de forma consistente en cada página. La marca se añade al título automáticamente.

interface SeoOptions {
  title: string // sin la marca; se añade "| Kuki Business"
  description: string
  path: string // ruta canónica, ej. '/catalogo'
  image?: string // ruta o URL absoluta; por defecto el logo
  type?: string // og:type (website | product | article…)
  noindex?: boolean // true en páginas privadas (login/portal)
}

export function useSeo(opts: SeoOptions) {
  const { public: pub } = useRuntimeConfig()
  const site = (pub.siteUrl as string).replace(/\/$/, '')
  const url = site + opts.path
  const fullTitle = `${opts.title} | Kuki Business`
  const img = opts.image
    ? opts.image.startsWith('http')
      ? opts.image
      : site + opts.image
    : site + '/img/logo.webp'

  useSeoMeta({
    title: fullTitle,
    description: opts.description,
    ogTitle: fullTitle,
    ogDescription: opts.description,
    ogType: opts.type || 'website',
    ogUrl: url,
    ogImage: img,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: opts.description,
    twitterImage: img,
    robots: opts.noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })
}

/** Inserta un bloque JSON-LD (datos estructurados schema.org). */
export function useJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(data) }],
  })
}
