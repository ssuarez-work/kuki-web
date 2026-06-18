// Subida de logos al bucket privado "logos" de Supabase Storage.
export function useStorage() {
  const client = useSupabaseClient()
  const { user } = useAuth()

  async function uploadLogo(file: File): Promise<string | null> {
    if (!client || !user.value) return null
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${user.value.id}/${Date.now()}-${safe}`
    const { error } = await client.storage.from('logos').upload(path, file, { upsert: false })
    if (error) throw error
    return path
  }

  return { uploadLogo }
}
