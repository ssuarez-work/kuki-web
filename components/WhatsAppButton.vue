<template>
  <button
    type="button"
    class="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow-card transition hover:scale-105 sm:bottom-5"
    style="background: #25d366"
    aria-label="Contactar por WhatsApp"
    @click="contact"
  >
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </button>
</template>

<script setup lang="ts">
const { openChat, greetingMessage } = useWhatsApp()

function contact() {
  openChat(greetingMessage())
}
</script>
