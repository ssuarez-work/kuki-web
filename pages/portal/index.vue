<template>
  <div class="container-kuki py-12">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-h1 text-fg">Hola, {{ company?.name || 'empresa' }}</h1>
        <p class="mt-1 text-muted">Gestiona tus pedidos y reordena en un clic.</p>
      </div>
      <button class="btn btn-ghost" @click="logout">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Salir
      </button>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      <NuxtLink to="/cotizador" class="card card-hover p-6">
        <i class="fa-solid fa-calculator text-xl text-highlight" aria-hidden="true"></i>
        <h2 class="mt-3 text-h3 text-fg">Nueva cotización</h2>
        <p class="mt-1 text-sm text-muted">Cotiza y crea un nuevo pedido.</p>
      </NuxtLink>
      <NuxtLink to="/portal/pedidos" class="card card-hover p-6">
        <i class="fa-solid fa-box text-xl text-highlight" aria-hidden="true"></i>
        <h2 class="mt-3 text-h3 text-fg">Mis pedidos</h2>
        <p class="mt-1 text-sm text-muted">Historial, estados y reorden 1-clic.</p>
      </NuxtLink>
      <NuxtLink to="/portal/disenos" class="card card-hover p-6">
        <i class="fa-solid fa-images text-xl text-highlight" aria-hidden="true"></i>
        <h2 class="mt-3 text-h3 text-fg">Mis diseños</h2>
        <p class="mt-1 text-sm text-muted">Logotipos y renders aprobados.</p>
      </NuxtLink>
    </div>

    <h2 class="mt-12 text-h2 text-fg">Pedidos recientes</h2>
    <div v-if="loading" class="mt-4 grid gap-3">
      <div v-for="i in 3" :key="i" class="skeleton h-16 rounded-brand"></div>
    </div>
    <div v-else-if="orders.length" class="mt-4 grid gap-3">
      <OrderRow v-for="o in orders.slice(0, 4)" :key="o.id" :order="o" />
    </div>
    <p v-else class="mt-4 text-muted">Aún no tienes pedidos. <NuxtLink to="/cotizador" class="text-fg underline">Crea el primero</NuxtLink>.</p>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/db'
definePageMeta({ middleware: 'auth' })
useSeo({ title: 'Portal B2B', description: 'Panel de cliente Kuki Business.', path: '/portal', noindex: true })

const { company, signOut } = useAuth()
const { listOrders } = useOrders()
const orders = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  orders.value = await listOrders()
  loading.value = false
})

async function logout() {
  await signOut()
  await navigateTo('/login')
}
</script>
