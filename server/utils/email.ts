// Envío de correos vía Resend (https://resend.com). No-op si no está configurado.
export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const cfg = useRuntimeConfig()
  const apiKey = cfg.resendApiKey as string
  const from = (cfg.emailFrom as string) || 'Kuki Business <pedidos@kuki.com.mx>'
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY no configurada; correo omitido:', opts.subject)
    return
  }
  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: { from, to: opts.to, subject: opts.subject, html: opts.html },
    })
  } catch (e) {
    console.error('[email] error al enviar:', e)
  }
}

export function orderConfirmationHtml(orderId: string, total: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#16142e">
      <h2>¡Gracias por tu pedido!</h2>
      <p>Tu pago fue confirmado y tu pedido <strong>#${orderId.slice(0, 8)}</strong> ya está
      <strong>listo para producción</strong>.</p>
      <p>Total pagado: <strong>${total}</strong></p>
      <p>Te avisaremos cuando entre a producción y cuando se envíe.</p>
      <p>— Kuki Business</p>
    </div>`
}

export function teamNotificationHtml(orderId: string, total: string, company: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#16142e">
      <h2>Nueva orden pagada</h2>
      <p>Pedido <strong>#${orderId.slice(0, 8)}</strong> de <strong>${company}</strong>.</p>
      <p>Total: <strong>${total}</strong></p>
      <p>Estado: Pago confirmado / Listo para producción.</p>
    </div>`
}
