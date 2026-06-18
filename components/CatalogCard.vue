<template>
  <article class="card card-hover flex flex-col overflow-hidden">
    <div class="aspect-square overflow-hidden bg-surface-2">
      <img
        :src="garment.image"
        :alt="`${garment.label} personalizable con tu logo — Kuki Business`"
        loading="lazy"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-h3 text-fg">{{ garment.label }}</h3>
      <p class="mt-1 text-sm text-muted">{{ garment.description }}</p>

      <div class="mt-4">
        <div class="mb-2 text-xs font-medium text-muted">
          {{ garment.colors.length }} colores disponibles
        </div>
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="color in garment.colors"
            :key="color.name"
            class="h-5 w-5 rounded-full border border-line"
            :style="{ backgroundColor: color.hex }"
            :title="color.name"
            :aria-label="color.name"
          ></li>
        </ul>
      </div>

      <div class="mt-5 flex items-end justify-between">
        <div>
          <div class="text-xs text-faint">Desde</div>
          <div class="text-xl font-bold text-highlight">{{ priceFromLabel }}</div>
          <div class="text-xs text-faint">por pieza · mejor precio por volumen</div>
        </div>
      </div>

      <div class="mt-5 flex gap-2">
        <NuxtLink :to="`/producto/${garment.slug}`" class="btn btn-primary flex-1" @click="trackSelect">
          Ver producto
        </NuxtLink>
        <button
          type="button"
          class="btn btn-ghost"
          :aria-label="`Pedir ${garment.label} por WhatsApp`"
          @click="askOnWhatsApp"
        >
          <i class="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { priceFrom, type GarmentType } from '~/utils/garments'

const props = defineProps<{ garment: GarmentType }>()
const { openChat, productMessage } = useWhatsApp()
const { gtag } = useGtag()

const priceFromLabel = computed(() => {
  const value = priceFrom(props.garment.id)
  return value == null ? '—' : formatMXN(value)
})

function askOnWhatsApp() {
  openChat(productMessage(props.garment.label))
}

function trackSelect() {
  gtag('event', 'select_item', {
    item_list_name: 'Catálogo',
    items: [{ item_name: props.garment.label, price: priceFrom(props.garment.id) ?? 0 }],
  })
}
</script>
