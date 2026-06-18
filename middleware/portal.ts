export default defineNuxtRouteMiddleware(() => {
  if (!usePortalEnabled()) return navigateTo('/')
})
