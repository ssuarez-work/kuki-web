interface QuoteMessageInput {
  garment: string
  quantity: number
  unitPrice: number
  total: number
  hasLogo: boolean
}

export function useWhatsApp() {
  const { public: pub } = useRuntimeConfig()
  const phone = pub.whatsappPhone as string

  function buildUrl(message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  function openChat(message: string): void {
    window.open(buildUrl(message), '_blank', 'noopener')
  }

  function quoteMessage(input: QuoteMessageInput): string {
    return [
      'Hola, quiero hacer un pedido de uniformes:',
      `• Prenda: ${input.garment}`,
      `• Cantidad: ${input.quantity} piezas`,
      `• Precio por pieza: ${formatMXN(input.unitPrice)}`,
      `• Total estimado: ${formatMXN(input.total)}`,
      '• Tallas: las confirmo en el chat.',
      input.hasLogo ? '• Adjuntaré mi logo aquí.' : '• Aún defino el logo.',
      'Entiendo que la producción inicia con un anticipo del 50%.',
    ].join('\n')
  }

  function productMessage(productName: string): string {
    return `Hola, me interesa cotizar uniformes del modelo: ${productName}.`
  }

  function productQuoteMessage(input: {
    garment: string
    quantity: number
    unitPrice: number
    total: number
  }): string {
    return [
      `Hola, quiero cotizar ${input.quantity} piezas de ${input.garment}.`,
      `Precio por pieza: ${formatMXN(input.unitPrice)}`,
      `Total estimado: ${formatMXN(input.total)} (más envío si aplica).`,
      'Adjunto mi logo o diseño personalizado en este chat.',
    ].join('\n')
  }

  function greetingMessage(): string {
    return 'Hola, quiero información sobre uniformes corporativos personalizados.'
  }

  return { phone, buildUrl, openChat, quoteMessage, productMessage, productQuoteMessage, greetingMessage }
}
