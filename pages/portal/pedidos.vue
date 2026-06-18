<template>
  <div class="container-kuki py-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted">
      <NuxtLink to="/portal" class="transition hover:text-fg">Portal</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">Pedidos</span>
    </nav>
    <h1 class="text-h1 text-fg">Mis pedidos</h1>
    <p class="mt-1 text-muted">Historial con estados y reorden en un clic.</p>

    <div v-if="loading" class="mt-8 grid gap-3">
      <div v-for="i in 4" :key="i" class="skeleton h-16 rounded-brand"></div>
    </div>
    <div v-else-if="orders.length" class="mt-8 grid gap-3">
      <OrderRow v-for="o in orders" :key="o.id" :order="o" />
    </div>
    <div v-else class="mt-8 card flex flex-col items-center gap-3 p-12 text-center">
      <i class="fa-solid fa-box-open text-3xl text-faint" aria-hidden="true"></i>
      <p class="font-medium text-fg">Aún no tienes pedidos</p>
      <NuxtLink to="/cotizador" class="btn btn-primary mt-2">Crear cotización</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/db'
definePageMeta({ middleware: 'auth' })
useSeo({ title: 'Mis pedidos', description: 'Historial de pedidos Kuki Business.', path: '/portal/pedidos', noindex: true })

const { listOrders } = useOrders()
const orders = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  orders.value = await listOrders()
  loading.value = false
})
</script>
