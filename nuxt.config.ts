// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-gtag'],

  css: ['~/assets/css/tailwind.css'],

  // Google Analytics 4. Define tu ID en .env (NUXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX).
  // Sin ID no carga ningún script (no rompe en desarrollo).
  gtag: {
    // El ID puede definirse en build o sobreescribirse en runtime con NUXT_PUBLIC_GTAG_ID.
    // Si está vacío, nuxt-gtag no inyecta ningún script (seguro en desarrollo).
    id: process.env.NUXT_PUBLIC_GTAG_ID || '',
    config: {
      anonymize_ip: true,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es-MX' },
      title: 'Uniformes Corporativos Personalizados en México',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Kuki Business — Uniformes y playeras corporativas personalizadas con tu logo. Cotiza por volumen en línea, sube tu logo y recibe en todo México.',
        },
        // SEO / social globales (lo específico de cada página se setea con useSeo)
        { name: 'author', content: 'Kuki Business' },
        { name: 'theme-color', content: '#100b24' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:site_name', content: 'Kuki Business' },
        { property: 'og:locale', content: 'es_MX' },
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/img/logo.webp' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/css/all.min.css',
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
        },
      ],
      // Anti-parpadeo: aplica el tema guardado antes del primer render.
      script: [
        {
          innerHTML:
            "try{if(localStorage.getItem('kuki-theme')==='light'){document.documentElement.classList.add('theme-light')}}catch(e){}",
          tagPosition: 'head',
        },
      ],
    },
  },

  // Las llaves reales se cargan desde .env (ver .env.example).
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    emailFrom: process.env.EMAIL_FROM || 'Kuki Business <pedidos@kuki.com.mx>',
    teamEmail: process.env.TEAM_EMAIL || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      whatsappPhone: process.env.WHATSAPP_PHONE || '529999985969',
      // URL canónica del sitio (cámbiala por tu dominio real cuando lo tengas).
      siteUrl: process.env.SITE_URL || 'https://kuki.com.mx',
    },
  },
})
