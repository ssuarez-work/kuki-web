<template>
  <div class="container-kuki flex min-h-[75vh] items-center justify-center py-12">
    <div class="card w-full max-w-md p-8">
      <div class="mb-6 flex items-center gap-2.5">
        <img src="/img/logo.webp" alt="Kuki Business" class="h-8 w-auto" />
        <span class="text-lg font-bold">Portal B2B</span>
      </div>

      <h1 class="text-h2 text-fg">{{ mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta' }}</h1>
      <p class="mt-1 text-sm text-muted">
        {{
          mode === 'login'
            ? 'Accede a tu historial de pedidos y reorden en 1 clic.'
            : 'Registra tu empresa para cotizar y reordenar sin fricción.'
        }}
      </p>

      <!-- Aviso si Supabase no está configurado -->
      <p v-if="!configured" class="mt-4 rounded-brand border border-line bg-surface-2 p-3 text-xs text-muted">
        El portal requiere configurar Supabase (<code>SUPABASE_URL</code> y
        <code>SUPABASE_ANON_KEY</code> en <code>.env</code>).
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <div v-if="mode === 'register'">
          <label class="mb-1 block text-sm font-medium text-muted" for="company">Empresa</label>
          <input id="company" v-model="companyName" type="text" class="field" placeholder="Nombre de tu empresa" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-muted" for="email">Correo</label>
          <input id="email" v-model="email" type="email" required class="field" placeholder="contacto@empresa.com" />
        </div>

        <div>
          <div class="mb-1 flex items-center justify-between">
            <label class="text-sm font-medium text-muted" for="pass">Contraseña</label>
            <button type="button" class="text-xs text-muted transition hover:text-fg" @click="show = !show">
              {{ show ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <input id="pass" v-model="password" :type="show ? 'text' : 'password'" required class="field" placeholder="••••••••" />
        </div>

        <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
        <p v-if="info" class="text-sm text-highlight">{{ info }}</p>

        <button class="btn btn-primary w-full" type="submit" :disabled="loading || !configured">
          {{ loading ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-muted">
        {{ mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button class="font-semibold text-fg underline-offset-2 hover:underline" @click="toggleMode">
          {{ mode === 'login' ? 'Regístrate' : 'Inicia sesión' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'portal' })
useSeo({
  title: 'Portal de Clientes B2B',
  description: 'Accede al portal B2B de Kuki Business: historial de pedidos, reorden en 1 clic y repositorio de diseños.',
  path: '/login',
  noindex: true,
})

const { signIn, signUp } = useAuth()
const configured = isSupabaseConfigured()

const mode = ref<'login' | 'register'>('login')
const show = ref(false)
const email = ref('')
const password = ref('')
const companyName = ref('')
const loading = ref(false)
const error = ref('')
const info = ref('')

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
  info.value = ''
}

async function onSubmit() {
  error.value = ''
  info.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await signIn(email.value, password.value)
      await navigateTo('/portal')
    } else {
      await signUp(email.value, password.value, companyName.value)
      info.value =
        'Cuenta creada. Si la confirmación por correo está activa, revisa tu bandeja; luego inicia sesión.'
      mode.value = 'login'
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Ocurrió un error. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
