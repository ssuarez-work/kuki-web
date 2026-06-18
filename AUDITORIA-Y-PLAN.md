# Küki — Auditoría del proyecto actual y Plan de migración B2B

**Fecha:** 2026-06-13
**Stack actual:** HTML + CSS + JS vanilla (sitio estático)
**Stack propuesto:** Nuxt 3 (Vue) + Supabase + Stripe + Tailwind CSS

---

## 1. Auditoría del proyecto actual

### 1.1 Estructura real encontrada

```
kuki-website/
├── index.html          # Landing (hero, catálogo demo, beneficios, cómo comprar, galería, testimonios, CTA)
├── catalogo.html       # Catálogo completo con filtros por categoría (CSS + JS)
├── products.json       # 11 productos (playeras Kimetsu no Yaiba)
└── assets/
    ├── css/            # (vacío)
    ├── js/products.js  # Render dinámico del catálogo + filtros por categoría
    └── img/
        ├── logo.webp   # Logo Küki (reutilizable ✅)
        └── products/   # 10 imágenes .webp de playeras (personajes de Kimetsu)
```

### 1.2 Cómo funciona hoy

- **100% estático.** No hay backend, base de datos, autenticación ni pagos.
- **Venta B2C por WhatsApp.** Cada botón "Comprar" abre `wa.me` con un mensaje pre-llenado. No hay carrito ni checkout.
- **Catálogo dinámico ligero.** `catalogo.html` carga `products.json` vía `fetch`, pinta tarjetas con un `<template>` y filtra por categoría (`kimetsu`, `tokyo`, `otros`) en cliente con JS + deep-link por query string (`?cat=`).
- **Precios fijos.** Cada producto tiene un precio único (`$349`), sin lógica por volumen.
- **Diseño "inline".** Todo el CSS está embebido en cada HTML (no hay hoja compartida → estilos duplicados entre `index.html` y `catalogo.html`).

### 1.3 Identidad visual a CONSERVAR (tu indicación)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0f0c22` | Fondo base (morado profundo) |
| `--ink` | `#eaf0ff` | Texto principal |
| `--sub` | `#cdd3f7` | Texto secundario |
| `--brand` | `#9D81FC` | Lila (marca) |
| `--accent` | `#D1FA30` | Lima (acentos, CTAs) |
| `--night` | `#1B1537` | Navy (barras/superficies) |
| Tipografía | **Poppins** (400–800) | Toda la UI |
| Radios | 18px / 28px | Tarjetas y bloques |
| Estilo | Glassmorphism oscuro, gradientes radiales lila+lima, sombras suaves | General |

Todo esto se migra **idéntico** a `tailwind.config` (theme.extend.colors + fontFamily) para no perder la estética.

### 1.4 Inconsistencias / deuda detectadas

1. **Marca inconsistente:** la landing dice "Küki" y el catálogo dice "Küri". Hay que unificar a **Küki**.
2. **CSS duplicado** entre los dos HTML → con Tailwind se elimina.
3. **`products.json` desalineado con el JS:** el JS espera categorías `kimetsu`/`tokyo`/`otros`, pero el JSON solo trae `kimetsu`. Faltan imágenes para `giyu`, `kyorojuro` y `obanai` (referenciadas en JSON pero no en `assets/img/products/`).
4. **`product.html` no existe** aunque el JS enlaza a `product.html?id=...` ("Ver detalles" lleva a página rota).
5. **Teléfono de WhatsApp es placeholder** (`521000000000`).
6. **El catálogo actual es B2C de anime** (Kimetsu), incompatible con el nuevo modelo B2B (uniformes corporativos por volumen). El modelo de datos cambia por completo.

### 1.5 🚨 Bloqueante para el cotizador

**El archivo `Tabulador_Precios_Playeras_B2B.xlsx` NO está en la carpeta ni en el zip.**
Es el insumo central del "Cotizador por volumen". Sin él no puedo codificar la lógica de precios real (rangos de cantidad → precio por pieza por tipo de prenda). Necesito que lo subas, o que me dictes la tabla (ej.: Polo Premium: 1–10 pzas = $X, 11–50 = $Y, 51+ = $Z, etc.).

---

## 2. ¿Es posible implementar lo que pides? — SÍ ✅

Todo lo solicitado es **estándar y probado** con el stack propuesto. No hay nada técnicamente arriesgado. Resumen de viabilidad por módulo:

| Módulo solicitado | ¿Viable? | Cómo se resuelve |
|---|---|---|
| Catálogo dinámico + filtros avanzados | ✅ | Nuxt + datos en Supabase (tabla `products`), filtros por tipo de prenda y stock |
| Calculadora por volumen en tiempo real | ✅ | Lógica de precios en Supabase (tabla `price_tiers`) + cálculo reactivo en el cliente *(requiere el xlsx)* |
| Carga de logotipos (drag & drop PNG/SVG/AI) | ✅ | Componente de subida → Supabase Storage (bucket privado) |
| Autenticación de empresas | ✅ | Supabase Auth (email/password + magic link) |
| Historial de pedidos con estados | ✅ | Tabla `orders` + estados (`en_diseño`, `en_producción`, `enviado`, `entregado`) + RLS |
| Reorden 1-clic (clonar pedido + logo) | ✅ | Clonar fila de `orders` reutilizando el logo guardado → Stripe Checkout |
| Repositorio de diseños aprobados | ✅ | Tabla `designs` + Storage, ligada al cliente |
| Stripe Checkout | ✅ | Stripe Checkout Session generada desde un server route de Nuxt |
| Webhook `checkout.session.completed` | ✅ | Supabase Edge Function (o Nuxt server route) que escucha el evento |
| Flujo post-pago automatizado | ✅ | El webhook: 1) cambia estado a "Pago confirmado / Listo para producción", 2) envía correo de recibo (Resend/Supabase), 3) notifica al equipo |

**Conclusión:** Es 100% implementable. El único requisito faltante para arrancar al 100% es el tabulador de precios.

---

## 3. Arquitectura propuesta

```
kuki-website/  (Nuxt 3)
├── nuxt.config.ts
├── tailwind.config.ts        # tokens de marca migrados (lila/lima/Poppins)
├── app.vue
├── pages/
│   ├── index.vue             # Landing (rediseño del index actual, mismo look)
│   ├── catalogo.vue          # Catálogo dinámico + filtros + cotizador
│   ├── producto/[id].vue     # Ficha de producto (la que faltaba)
│   ├── cotizador.vue         # Cotizador por volumen + carga de logo
│   ├── login.vue             # Supabase Auth
│   └── portal/               # Panel B2B (protegido)
│       ├── index.vue         # Dashboard
│       ├── pedidos.vue       # Historial + estados + reorden 1-clic
│       └── disenos.vue       # Repositorio de diseños aprobados
├── components/
│   ├── ProductCard.vue
│   ├── VolumeCalculator.vue  # cálculo reactivo por cantidad
│   ├── LogoUploader.vue      # drag & drop → Supabase Storage
│   └── ...
├── composables/
│   ├── useSupabase.ts
│   ├── usePricing.ts         # lógica del tabulador
│   └── useCart.ts
├── server/
│   ├── api/checkout.post.ts          # crea Stripe Checkout Session
│   └── api/webhooks/stripe.post.ts   # escucha checkout.session.completed
├── supabase/
│   ├── migrations/           # SQL del esquema + RLS
│   └── functions/            # Edge Functions (webhook alternativo)
└── public/assets/img/        # logo.webp + imágenes (reutilizadas)
```

### 3.1 Modelo de datos (Supabase / PostgreSQL)

- **`companies`** — empresas cliente (ligadas a `auth.users`): nombre, RFC, contacto, dirección.
- **`products`** — catálogo B2B: nombre, tipo (`polo_premium`, `deportiva`, `cuello_redondo`), descripción, stock, imágenes.
- **`price_tiers`** — rangos de volumen: `product_type`, `min_qty`, `max_qty`, `price_per_unit` *(viene del xlsx)*.
- **`orders`** — pedidos: empresa, items (jsonb), logo_url, total, estado, stripe_session_id.
- **`designs`** — repositorio de logos/renders aprobados por empresa.
- **RLS (Row Level Security):** cada empresa solo ve sus pedidos y diseños.

---

## 4. Plan de trabajo por fases

### Fase 0 — Preparación y decisiones (0.5 día)
- [ ] Subir `Tabulador_Precios_Playeras_B2B.xlsx` (BLOQUEANTE del cotizador).
- [ ] Confirmar: ¿se descarta el catálogo de anime (Kimetsu) o conviven con la línea B2B?
- [ ] Crear cuentas: proyecto en Supabase, cuenta de Stripe, dominio/hosting (Vercel/Netlify recomendado para Nuxt).
- [ ] Definir tipos de prenda y catálogo inicial B2B (Polo Premium, Deportiva, Cuello Redondo, …).

### Fase 1 — Scaffolding y diseño base (1–2 días)
- [ ] Inicializar Nuxt 3 + Tailwind sobre la carpeta.
- [ ] Migrar tokens de marca a `tailwind.config` (mismos colores/tipografía).
- [ ] Reutilizar `logo.webp` e imágenes existentes.
- [ ] Recrear landing (`index.vue`) con el mismo look corporativo + componentes reusables.
- [ ] Unificar marca a "Küki".

### Fase 2 — Catálogo dinámico + cotizador (2–3 días)
- [ ] Esquema Supabase: `products`, `price_tiers`. Seed con datos reales.
- [ ] Catálogo con filtros avanzados (tipo de prenda + stock).
- [ ] `VolumeCalculator.vue`: cálculo de precio por pieza en tiempo real según cantidad.
- [ ] `LogoUploader.vue`: drag & drop a Supabase Storage.
- [ ] Ficha de producto `producto/[id].vue`.

### Fase 3 — Portal B2B + Auth (2–3 días)
- [ ] Supabase Auth (registro/login de empresas) + middleware de rutas protegidas.
- [ ] Tabla `companies` + perfil de empresa.
- [ ] Historial de pedidos con estados visuales.
- [ ] Repositorio de diseños aprobados.
- [ ] RLS para aislar datos por empresa.

### Fase 4 — Pagos y automatización (2–3 días)
- [ ] `server/api/checkout.post.ts` → Stripe Checkout Session.
- [ ] Webhook `checkout.session.completed`.
- [ ] Flujo post-pago: estado → "Listo para producción" + correo de recibo + notificación al equipo.
- [ ] Botón de **reorden 1-clic** (clonar pedido + logo guardado → checkout).

### Fase 5 — Pulido y despliegue (1–2 días)
- [ ] Responsive (móvil primero) y QA de accesibilidad.
- [ ] SEO/SSR (meta tags, sitemap) — Nuxt lo facilita.
- [ ] Variables de entorno y despliegue a producción.
- [ ] Pruebas end-to-end del flujo de compra.

**Estimación total:** ~9–15 días de desarrollo efectivo.

---

## 5. Lo que necesito de ti para arrancar

1. **`Tabulador_Precios_Playeras_B2B.xlsx`** (o la tabla de precios por volumen dictada). ← prioridad 1
2. Decisión: ¿catálogo B2B puro, o mantener también la línea de playeras de anime?
3. Catálogo inicial B2B real (tipos de prenda, fotos, stock).
4. Accesos/claves (cuando toque): Supabase URL+keys, Stripe keys, dominio.
5. Datos de contacto reales (WhatsApp, correo del equipo para notificaciones).

> Con el punto 1 resuelto puedo empezar de inmediato por la Fase 1 (scaffolding) sin esperar lo demás.
