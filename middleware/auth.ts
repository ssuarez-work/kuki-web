export default defineNuxtRouteMiddleware(async () => {
  if (!usePortalEnabled()) return navigateTo('/')
  if (import.meta.server) return
  const client = useSupabaseClient()
  if (!client) return navigateTo('/login')
  const { data } = await client.auth.getSession()
  if (!data.session) return navigateTo('/login')
})
