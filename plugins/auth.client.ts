// Inicializa la sesión de Supabase al cargar la app en el cliente.
export default defineNuxtPlugin(async () => {
  if (!isSupabaseConfigured()) return
  await useAuth().init()
})
