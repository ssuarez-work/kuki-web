// Sitemap dinámico: usa la URL del sitio de runtimeConfig.
import { GARMENT_TYPES } from '~/utils/garments'

export default defineEventHandler((event) => {
  const site = (useRuntimeConfig(event).public.siteUrl as string).replace(/\/$/, '')
  const routes = [
    { loc: '/', priority: '1.0' },
    { loc: '/catalogo', priority: '0.8' },
    { loc: '/cotizador', priority: '0.8' },
    ...GARMENT_TYPES.map((garment) => ({ loc: `/producto/${garment.slug}`, priority: '0.7' })),
    { loc: '/aviso-de-privacidad', priority: '0.3' },
  ]
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${site}${r.loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
