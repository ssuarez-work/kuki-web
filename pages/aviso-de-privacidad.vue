<template>
  <div class="container-kuki py-12">
    <nav class="mb-5 flex items-center gap-2 text-sm text-muted" aria-label="Ruta de navegación">
      <NuxtLink to="/" class="transition hover:text-fg">Inicio</NuxtLink>
      <i class="fa-solid fa-chevron-right text-xs text-faint" aria-hidden="true"></i>
      <span class="text-fg">Aviso de Privacidad</span>
    </nav>

    <h1 class="text-h1 text-fg">Aviso de Privacidad</h1>
    <p class="mt-2 text-sm text-faint">Última actualización: junio de 2026.</p>

    <div class="mt-8 max-w-prose space-y-8">
      <section>
        <h2 class="text-h3 text-fg">1. Responsable del tratamiento</h2>
        <p class="mt-2 text-muted">
          Kuki Business, con domicilio en Mérida, Yucatán, México, es responsable del uso y
          protección de tus datos personales, conforme a la Ley Federal de Protección de Datos
          Personales en Posesión de los Particulares (LFPDPPP).
        </p>
        <p class="mt-2 text-faint">
          [Por completar: razón social, RFC y domicilio fiscal completo.]
        </p>
      </section>

      <section>
        <h2 class="text-h3 text-fg">2. Datos personales que recabamos</h2>
        <p class="mt-2 text-muted">Para atender tus cotizaciones y pedidos podemos recabar:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>Nombre y nombre de tu empresa.</li>
          <li>Datos de contacto: teléfono, WhatsApp y, en su caso, correo electrónico.</li>
          <li>Logotipo, diseños o archivos que nos compartas para personalizar las prendas.</li>
          <li>Domicilio o código postal para la entrega o envío.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-h3 text-fg">3. Finalidades</h2>
        <p class="mt-2 text-muted"><strong class="text-fg">Primarias:</strong></p>
        <ul class="mt-1 list-disc space-y-1 pl-5 text-muted">
          <li>Elaborar y dar seguimiento a tus cotizaciones y pedidos.</li>
          <li>Producir, entregar o enviar las prendas solicitadas.</li>
          <li>Emitir comprobantes o facturas cuando lo solicites.</li>
          <li>Atender dudas, aclaraciones y servicio al cliente.</li>
        </ul>
        <p class="mt-3 text-muted"><strong class="text-fg">Secundarias:</strong></p>
        <ul class="mt-1 list-disc space-y-1 pl-5 text-muted">
          <li>Enviarte promociones o novedades. Puedes negarte sin que afecte tu pedido.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-h3 text-fg">4. Transferencias de datos</h2>
        <p class="mt-2 text-muted">
          No transferimos tus datos personales a terceros sin tu consentimiento, salvo a
          proveedores que nos ayudan a operar (por ejemplo, paqueterías para el envío) o cuando la
          ley lo requiera. Estos terceros usan tus datos únicamente para el fin solicitado.
        </p>
      </section>

      <section>
        <h2 class="text-h3 text-fg">5. Derechos ARCO</h2>
        <p class="mt-2 text-muted">
          Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales, así como a Oponerte
          a su tratamiento o revocar tu consentimiento. Para ejercerlos, contáctanos por WhatsApp y
          te indicaremos el procedimiento.
        </p>
        <a :href="whatsappUrl" class="btn btn-ghost mt-4">
          <i class="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i> Ejercer mis derechos
        </a>
      </section>

      <section>
        <h2 class="text-h3 text-fg">6. Uso de cookies y tecnologías</h2>
        <p class="mt-2 text-muted">
          Nuestro sitio puede usar cookies y herramientas de análisis (como Google Analytics) para
          entender cómo se navega y mejorar la experiencia. Puedes deshabilitar las cookies desde la
          configuración de tu navegador.
        </p>
      </section>

      <section>
        <h2 class="text-h3 text-fg">7. Cambios al aviso</h2>
        <p class="mt-2 text-muted">
          Este aviso puede actualizarse. Publicaremos cualquier cambio en esta misma página, por lo
          que te recomendamos revisarla periódicamente.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { buildUrl, greetingMessage } = useWhatsApp()
const whatsappUrl = buildUrl(greetingMessage())

useSeo({
  title: 'Aviso de Privacidad',
  description: 'Aviso de Privacidad de Kuki Business conforme a la LFPDPPP: datos que recabamos, finalidades y derechos ARCO.',
  path: '/aviso-de-privacidad',
})
</script>
