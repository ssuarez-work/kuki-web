import { buildQuoteMessage, type QuoteMessageData } from '~/utils/quoteMessage'
import type { OrderDelivery, OrderItem } from '~/types/db'

export interface QuoteSubmitPayload {
  messageData: QuoteMessageData
  orderItems: OrderItem[]
  delivery: OrderDelivery
  logoFile: File | null
}

export interface QuoteSubmissionStrategy {
  cta: string
  submit: (payload: QuoteSubmitPayload) => Promise<void>
}

function whatsAppStrategy(): QuoteSubmissionStrategy {
  const { openChat } = useWhatsApp()
  return {
    cta: 'Pedir por WhatsApp',
    async submit(payload) {
      openChat(buildQuoteMessage(payload.messageData))
    },
  }
}

function checkoutStrategy(): QuoteSubmissionStrategy {
  const { user } = useAuth()
  const { createOrder, startCheckout } = useOrders()
  const { uploadLogo } = useStorage()
  return {
    cta: 'Continuar al pago',
    async submit(payload) {
      if (!user.value) {
        await navigateTo('/login')
        return
      }
      const logoPath = payload.logoFile ? await uploadLogo(payload.logoFile) : null
      const order = await createOrder(payload.orderItems, payload.delivery, logoPath)
      await startCheckout(order.id)
    },
  }
}

export function useQuoteSubmission(): QuoteSubmissionStrategy {
  return isSupabaseConfigured() ? checkoutStrategy() : whatsAppStrategy()
}
