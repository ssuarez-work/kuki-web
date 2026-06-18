<template>
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-fg transition hover:bg-surface-2"
    :aria-label="theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
    :title="theme === 'dark' ? 'Tema claro' : 'Tema oscuro'"
    @click="toggle"
  >
    <i v-if="theme === 'dark'" class="fa-solid fa-sun" aria-hidden="true"></i>
    <i v-else class="fa-solid fa-moon" aria-hidden="true"></i>
  </button>
</template>

<script setup lang="ts">
const { theme, toggle, init } = useTheme()
onMounted(init)
</script>
