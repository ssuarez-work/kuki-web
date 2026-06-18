# Kuki Business — Plataforma B2B de uniformes corporativos

Migración del sitio estático original a **Nuxt 3 + Tailwind CSS** (Fase 1 completada).
Próximas fases: Supabase (datos/auth/storage) y Stripe (pagos + webhooks).

Ver el plan completo en [`AUDITORIA-Y-PLAN.md`](./AUDITORIA-Y-PLAN.md).

## Requisitos
- Node 18+ (probado en Node 22)

## Desarrollo
```bash
npm install
cp .env.example .env   # rellena tus llaves cuando conectemos Supabase/Stripe
npm run dev            # http://localhost:3000
```

## Producción
```bash
npm run build
npm run preview
```
Despliegue recomendado: **Vercel** o **Netlify** (soporte nativo de Nuxt/SSR).

## Estructura
```
pages/        index, catalogo, cotizador, login  (portal/ en Fase 3)
components/    TheHeader, TheFooter  (+ ProductCard, LogoUploader en Fase 2)
composables/   usePricing  (tarifas de ejemplo → reemplazar por tabulador real)
layouts/       default (header + footer)
assets/css/    tailwind.css (identidad Kuki Business migrada)
public/img/    logo.webp + imágenes reutilizadas del sitio original
server/api/    checkout + webhooks de Stripe (Fase 4)
_legacy/       sitio estático original (respaldo)
```

## Identidad visual (conservada)
Lila `#9D81FC` · Lima `#D1FA30` · Fondo `#0f0c22` · Navy `#1B1537` · Tipografía Poppins.
Definida en `tailwind.config.ts` y `assets/css/tailwind.css`.

## Temas (comparación visual)
El sitio incluye **dos direcciones visuales conmutables** con el botón ☀️/🌙 del header:
- **Oscuro refinado** (por defecto): morado/lima depurado, acento lima escaso.
- **Claro corporativo** (`.theme-light`): fondo claro, lila como primario.

Tokens en `assets/css/tailwind.css` (`:root` y `.theme-light`). La preferencia se guarda en `localStorage`.
Ver auditoría y plan en [`AUDITORIA-UXUI.md`](./AUDITORIA-UXUI.md).

## Plataforma (Supabase + Stripe) — puesta en marcha

El código de la plataforma está listo y es **env-gated**: sin llaves el sitio funciona
(el cotizador cae en cotización por WhatsApp); con llaves se activa todo el flujo.

1. **Supabase:** crea un proyecto en supabase.com.
   - Aplica el esquema: pega `supabase/migrations/0001_init.sql` en el SQL Editor (crea tablas,
     RLS, trigger de empresa, bucket `logos` y seed de productos/tarifas).
   - Copia URL y llaves a `.env` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
2. **Stripe:** crea cuenta, copia `STRIPE_SECRET_KEY`.
   - Configura un webhook a `https://TU-DOMINIO/api/webhooks/stripe` (evento
     `checkout.session.completed`) y copia el `STRIPE_WEBHOOK_SECRET`.
3. **Correos (Resend):** `RESEND_API_KEY`, `EMAIL_FROM` (dominio verificado), `TEAM_EMAIL`.
4. **Sitio:** `SITE_URL`, `NUXT_PUBLIC_GTAG_ID`.

Flujo: cotizar → (login) → subir logo a Storage → crear pedido → Stripe Checkout →
webhook marca `pago_confirmado` + correo al cliente + aviso al equipo → portal con historial y reorden.

## Estado por fase
- [x] Fase 1 — Scaffolding Nuxt + Tailwind + landing B2B
- [x] UX/UI P0+P1 — tokens, 2 temas, header móvil, foco, cotizador sticky, catálogo, footer, login
- [x] SEO — meta por página, OG, JSON-LD, sitemap, robots
- [x] Analytics — GA4 (nuxt-gtag) + eventos de conversión
- [x] Fase 2 — Catálogo/cotizador con tabulador real + datos Supabase (seed) + Storage
- [x] Fase 3 — Portal B2B + Supabase Auth + RLS (historial, reorden, diseños)
- [x] Fase 4 — Stripe Checkout + webhook + correos (cliente/equipo)
- [ ] Fase 5 — Despliegue (Vercel) + dominio + contenido real + legal (en curso)
```
