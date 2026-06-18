<template>
  <div class="card p-6">
    <div class="flex items-start justify-between gap-4">
      <span class="text-sm font-semibold text-muted">Prenda {{ index + 1 }}</span>
      <button
        v-if="removable"
        type="button"
        class="text-sm text-muted transition hover:text-fg"
        :aria-label="`Quitar prenda ${index + 1}`"
        @click="$emit('remove')"
      >
        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
      </button>
    </div>

    <label class="mb-2 mt-4 block text-sm font-medium text-muted">Tipo de prenda</label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="garment in GARMENT_TYPES"
        :key="garment.id"
        type="button"
        class="chip cursor-pointer px-4 py-2 text-sm transition"
        :class="{ 'chip-active': line.garment === garment.id }"
        @click="line.garment = garment.id"
      >
        {{ garment.label }}
      </button>
    </div>

    <div class="mt-5 sm:max-w-xs">
      <label class="mb-2 block text-sm font-medium text-muted" :for="`qty-${line.id}`">
        Cantidad de piezas
      </label>
      <input
        :id="`qty-${line.id}`"
        v-model.number="line.quantity"
        type="number"
        min="1"
        step="1"
        inputmode="numeric"
        class="field"
        placeholder="Ej. 45"
      />
      <p class="mt-2 text-xs text-faint">Precio por pieza: {{ unitPriceLabel }}</p>
    </div>

    <div class="mt-5">
      <label class="mb-2 block text-sm font-medium text-muted">Desglose por tallas (opcional)</label>
      <div class="flex flex-wrap gap-2">
        <div v-for="size in SIZES" :key="size" class="w-20">
          <span class="mb-1 block text-center text-xs text-faint">{{ size }}</span>
          <input
            v-model.number="line.sizes[size]"
            type="number"
            min="0"
            step="1"
            class="field px-2 text-center"
            :aria-label="`Cantidad talla ${size}`"
          />
        </div>
      </div>
      <p v-if="mismatch" class="mt-2 text-xs text-amber-400">
        Las tallas suman {{ sizesCount }} y la cantidad es {{ line.quantity }}.
      </p>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-line pt-4">
      <span class="text-sm text-muted">Subtotal de esta prenda</span>
      <span class="font-bold text-highlight">{{ formatMXN(lineTotal) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GARMENT_TYPES, unitPriceFor } from '~/utils/garments'
import { SIZES, type QuoteLine } from '~/types/quote'

const props = defineProps<{ line: QuoteLine; index: number; removable: boolean }>()
defineEmits<{ remove: [] }>()

const unitPrice = computed(() => unitPriceFor(props.line.garment, props.line.quantity))
const unitPriceLabel = computed(() => (unitPrice.value ? formatMXN(unitPrice.value) : '—'))
const lineTotal = computed(() =>
  unitPrice.value && props.line.quantity > 0 ? unitPrice.value * props.line.quantity : 0,
)
const sizesCount = computed(() => SIZES.reduce((sum, size) => sum + (props.line.sizes[size] ?? 0), 0))
const mismatch = computed(() => sizesCount.value > 0 && sizesCount.value !== props.line.quantity)
</script>
