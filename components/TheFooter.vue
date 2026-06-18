<template>
  <footer class="mt-16 border-t border-line">
    <div class="container-kuki grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Marca -->
      <div>
        <NuxtLink to="/" class="flex items-center gap-2.5 font-bold">
          <img src="/img/logo.webp" alt="Kuki Business" class="h-8 w-auto" />
          <span class="text-lg">Kuki Business</span>
        </NuxtLink>
        <p class="mt-3 max-w-[28ch] text-sm text-muted">
          Uniformes y playeras corporativas personalizadas. Calidad premium con envíos a todo
          México.
        </p>
      </div>

      <!-- Navegación -->
      <div>
        <h3 class="mb-3 text-sm font-semibold text-fg">Navegación</h3>
        <ul class="space-y-2 text-sm text-muted">
          <li><NuxtLink class="transition hover:text-fg" to="/catalogo">Catálogo</NuxtLink></li>
          <li><NuxtLink class="transition hover:text-fg" to="/cotizador">Cotizador</NuxtLink></li>
          <li v-if="portalEnabled"><NuxtLink class="transition hover:text-fg" to="/login">Portal B2B</NuxtLink></li>
        </ul>
      </div>

      <!-- Contacto -->
      <div>
        <h3 class="mb-3 text-sm font-semibold text-fg">Contacto</h3>
        <ul class="space-y-2 text-sm text-muted">
          <li>
            <a class="inline-flex items-center gap-2 transition hover:text-fg" :href="whatsappUrl">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
            </a>
          </li>
        </ul>
      </div>

      <!-- Redes / Legal -->
      <div>
        <h3 class="mb-3 text-sm font-semibold text-fg">Síguenos</h3>
        <ul class="space-y-2 text-sm text-muted">
          <li>
            <a class="inline-flex items-center gap-2 transition hover:text-fg" href="#">
              <i class="fa-brands fa-instagram" aria-hidden="true"></i> Instagram
            </a>
          </li>
          <li>
            <a class="inline-flex items-center gap-2 transition hover:text-fg" href="#">
              <i class="fa-brands fa-facebook" aria-hidden="true"></i> Facebook
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-line">
      <div
        class="container-kuki flex flex-col items-center justify-between gap-3 py-5 text-sm text-faint sm:flex-row"
      >
        <span>© {{ year }} Kuki Business. Todos los derechos reservados.</span>
        <div class="flex gap-4">
          <NuxtLink class="transition hover:text-fg" to="/aviso-de-privacidad">Aviso de Privacidad</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { buildUrl, greetingMessage } = useWhatsApp()
const whatsappUrl = buildUrl(greetingMessage())
const portalEnabled = usePortalEnabled()
const year = new Date().getFullYear()
</script>
