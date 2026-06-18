import type { Company } from '~/types/db'

// Autenticación de empresas con Supabase Auth (lado cliente).
export function useAuth() {
  const user = useState<{ id: string; email?: string } | null>('auth-user', () => null)
  const company = useState<Company | null>('auth-company', () => null)
  const ready = useState<boolean>('auth-ready', () => false)
  const client = useSupabaseClient()

  async function init() {
    if (!client) {
      ready.value = true
      return
    }
    const { data } = await client.auth.getUser()
    user.value = data.user ? { id: data.user.id, email: data.user.email } : null
    if (user.value) await loadCompany()
    client.auth.onAuthStateChange(async (_e, session) => {
      user.value = session?.user ? { id: session.user.id, email: session.user.email } : null
      if (user.value) await loadCompany()
      else company.value = null
    })
    ready.value = true
  }

  async function loadCompany() {
    if (!client || !user.value) return
    const { data } = await client
      .from('companies')
      .select('*')
      .eq('user_id', user.value.id)
      .maybeSingle()
    company.value = (data as Company) ?? null
  }

  async function signIn(email: string, password: string) {
    if (!client) throw new Error('Supabase no está configurado.')
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) throw error
    await loadCompany()
  }

  async function signUp(email: string, password: string, companyName: string) {
    if (!client) throw new Error('Supabase no está configurado.')
    const { error } = await client.auth.signUp({
      email,
      password,
      options: { data: { company_name: companyName } },
    })
    if (error) throw error
  }

  async function signOut() {
    if (!client) return
    await client.auth.signOut()
    user.value = null
    company.value = null
  }

  return { user, company, ready, init, loadCompany, signIn, signUp, signOut }
}
