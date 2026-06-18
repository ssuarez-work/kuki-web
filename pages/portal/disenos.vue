<template>
  <div class="container-kuki py-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted">
      <NuxtLink to="/portal" class="transition hover:text-fg">Portal</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">Diseños</span>
    </nav>
    <h1 class="text-h1 text-fg">Mis diseños</h1>
    <p class="mt-1 text-muted">Logotipos y renders aprobados para tus uniformes.</p>

    <div v-if="loading" class="mt-8 grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div v-for="i in 4" :key="i" class="skeleton aspect-square rounded-brand"></div>
    </div>
    <div v-else-if="designs.length" class="mt-8 grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div v-for="d in designs" :key="d.id" class="card overflow-hidden">
        <div class="aspect-square bg-surface-2"></div>
        <div class="p-3">
          <div class="truncate font-medium text-fg">{{ d.name }}</div>
          <span class="chip mt-1" :style="d.approved ? 'background: var(--c-primary); color: var(--c-primary-ink); border-color: transparent' : ''">
            {{ d.approved ? 'Aprobado' : 'En revisión' }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="mt-8 card flex flex-col items-center gap-3 p-12 text-center">
      <i class="fa-solid fa-images text-3xl text-faint" aria-hidden="true"></i>
      <p class="font-medium text-fg">Aún no hay diseños aprobados</p>
      <p class="text-sm text-muted">Cuando aprobemos los logos de tus pedidos, aparecerán aquí.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Design } from '~/types/db'
definePageMeta({ middleware: 'auth' })
useSeo({ title: 'Mis diseños', description: 'Repositorio de diseños Kuki Business.', path: '/portal/disenos', noindex: true })

const client = useSupabaseClient()
const { company, loadCompany } = useAuth()
const designs = ref<Design[]>([])
const loading = ref(true)

onMounted(async () => {
  if (client) {
    if (!company.value) await loadCompany()
    if (company.value) {
      const { data } = await client.from('designs').select('*').eq('company_id', company.value.id).order('created_at', { ascending: false })
      designs.value = (data as Design[]) ?? []
    }
  }
  loading.value = false
})
</script>
