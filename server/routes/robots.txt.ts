// robots.txt dinámico con referencia al sitemap.
export default defineEventHandler((event) => {
  const site = (useRuntimeConfig(event).public.siteUrl as string).replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *
Allow: /
Disallow: /login
Disallow: /portal

Sitemap: ${site}/sitemap.xml
`
})
