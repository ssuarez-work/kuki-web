<template>
  <div class="card flex flex-wrap items-center justify-between gap-4 p-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-fg">#{{ order.id.slice(0, 8) }}</span>
        <span class="chip" :style="badgeStyle">{{ statusLabel }}</span>
      </div>
      <div class="mt-1 truncate text-sm text-muted">{{ itemsSummary }}</div>
      <div class="text-xs text-faint">{{ dateLabel }}</div>
    </div>
    <div class="flex items-center gap-3">
      <span class="font-bold text-highlight">{{ formatMXN(order.total) }}</span>
      <button
        v-if="order.status === 'pago_pendiente'"
        class="btn btn-primary"
        :disabled="busy"
        @click="pay"
      >
        Pagar
      </button>
      <button class="btn btn-ghost" :disabled="busy" @click="doReorder">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reordenar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ORDER_STATUS_LABELS, type Order } from '~/types/db'

const props = defineProps<{ order: Order }>()
const { reorder, startCheckout } = useOrders()
const busy = ref(false)

const statusLabel = computed(() => ORDER_STATUS_LABELS[props.order.status] ?? props.order.status)
const itemsSummary = computed(() =>
  props.order.items.map((i) => `${i.qty}× ${i.name}`).join(', ') || 'Sin artículos',
)
const dateLabel = computed(() =>
  new Date(props.order.created_at).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
)
const badgeStyle = computed(() =>
  props.order.status === 'pago_pendiente'
    ? 'background: color-mix(in srgb, #f87171 18%, transparent); border-color: transparent'
    : props.order.status === 'entregado'
      ? 'background: var(--c-primary); color: var(--c-primary-ink); border-color: transparent'
      : '',
)

async function pay() {
  busy.value = true
  try {
    await startCheckout(props.order.id)
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al iniciar el pago')
  } finally {
    busy.value = false
  }
}

async function doReorder() {
  busy.value = true
  try {
    const o = await reorder(props.order)
    await startCheckout(o.id)
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al reordenar')
  } finally {
    busy.value = false
  }
}
</script>
