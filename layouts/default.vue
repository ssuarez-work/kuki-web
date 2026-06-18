<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
    <WhatsAppButton />
  </div>
</template>
