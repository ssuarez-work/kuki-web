<template>
  <header
    class="sticky top-0 z-50 border-b border-line backdrop-blur"
    style="background: color-mix(in srgb, var(--c-bg) 80%, transparent)"
  >
    <div class="container-kuki flex h-16 items-center justify-between gap-3">
      <!-- Marca -->
      <NuxtLink to="/" class="flex items-center gap-2.5 font-bold">
        <img src="/img/logo.webp" alt="Kuki Business" class="h-8 w-auto" />
        <span class="text-lg tracking-tight">Kuki Business</span>
      </NuxtLink>

      <!-- Nav desktop -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-fg"
          :class="{ 'text-fg': isActive(l.to) }"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <!-- Acciones -->
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <NuxtLink to="/cotizador" class="btn btn-primary hidden sm:inline-flex">Cotizar</NuxtLink>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface md:hidden"
          aria-label="Abrir menú"
          :aria-expanded="open"
          @click="open = !open"
        >
          <i :class="open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-lg" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- Menú móvil -->
    <Transition
      enter-active-class="transition duration-200 ease-smooth"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="open" class="border-t border-line md:hidden" style="background: var(--c-bg)">
        <div class="container-kuki flex flex-col gap-1 py-3">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="rounded-brand px-3 py-3 text-base font-medium text-muted transition hover:bg-surface hover:text-fg"
            :class="{ 'text-fg': isActive(l.to) }"
            @click="open = false"
          >
            {{ l.label }}
          </NuxtLink>
          <NuxtLink to="/cotizador" class="btn btn-primary mt-1" @click="open = false">
            Cotizar
          </NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const open = ref(false)
const { user } = useAuth()
const portalEnabled = usePortalEnabled()

const links = computed(() => {
  const base = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/cotizador', label: 'Cotizador' },
  ]
  if (!portalEnabled) return base
  return [...base, user.value ? { to: '/portal', label: 'Mi portal' } : { to: '/login', label: 'Portal B2B' }]
})

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

// Cierra el menú al navegar
watch(() => route.path, () => (open.value = false))
</script>
