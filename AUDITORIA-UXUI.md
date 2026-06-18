# Küki — Auditoría UX/UI y Plan de mejoras

**Fecha:** 2026-06-14
**Objetivo:** UI minimalista pero agradable, UX impecable, look 100% profesional, perfecto en móvil y desktop.
**Alcance auditado:** `TheHeader`, `TheFooter`, `pages/index`, `pages/catalogo`, `pages/cotizador`, `pages/login`, `assets/css/tailwind.css`.

---

## 0. Diagnóstico general (resumen ejecutivo)

El sitio ya tiene una base sólida (Nuxt + Tailwind, identidad de marca, cotizador funcional). Pero hoy se siente **más "consumer/landing creativa" que "proveedor corporativo B2B"**, por tres motivos:

1. **Sobrecarga visual.** Hay gradientes radiales en el `body`, en el hero, en las cards, en el CTA y en cada chip. El acento lima neón (`#D1FA30`) aparece por todas partes. "Minimalista" pide justo lo contrario: superficies calmadas, **un solo acento usado con intención**, y dejar respirar el contenido.
2. **Placeholders visibles.** El hero es una caja de gradiente vacía y el catálogo son tarjetas sin foto. Un comprador B2B necesita **ver el producto** y **señales de confianza** (logos de clientes, certificaciones, datos de contacto reales).
3. **Huecos de UX.** No hay menú móvil, ni estados de foco visibles, ni estados de carga/vacío/error, ni validación en formularios. Estos detalles son los que separan "se ve bien" de "se siente impecable".

> **Veredicto:** el esqueleto es bueno; falta **depurar (menos es más)**, **llenar con contenido real** y **cerrar los detalles de interacción**.

---

## 1. Identidad visual y estilo (the look)

### Hallazgos
- **Densidad de gradientes alta.** `tailwind.css` aplica doble gradiente radial fijo al `body`; `index.vue` añade más en hero, cards y CTA. Resultado: fondo "ruidoso" que compite con el contenido.
- **Acento lima sobreexpuesto.** El lima se usa en CTAs, chips activos, precios, números de pasos, iconos. Pierde fuerza por repetición. En diseño profesional el color de acento debe ser "caro": se usa poco para que destaque.
- **Inconsistencia de superficies.** Hay 3–4 fórmulas distintas de "fondo de tarjeta" repetidas como `style="..."` inline (hero mock, CTA, thumbs). Falta un sistema de tokens/clases.
- **Falta de jerarquía cromática.** Texto principal, secundario y deshabilitado no tienen una escala clara y consistente.

### Recomendaciones (minimalismo profesional)
- **Reducir gradientes a uno solo y muy sutil** (o un fondo plano `#0f0c22` con una sola luz tenue arriba). El contenido manda.
- **Regla del acento único:** lima **solo** para la acción primaria de cada vista (1 CTA) y para el dato clave del cotizador (precio/total). Todo lo demás en neutros (lila para foco/links, blancos translúcidos para superficies).
- **Sistema de superficies:** definir `surface-1`, `surface-2`, `divider` como tokens y borrar los `style=` inline.
- **Más aire:** subir el espaciado vertical entre secciones y dentro de cards; menos bordes, sombras más suaves y consistentes.

---

## 2. Layout, espaciado y responsive (móvil + desktop)

### Hallazgos
- **Header sin menú móvil 🔴.** En `TheHeader.vue` el enlace "Catálogo" es `hidden sm:inline-flex` → **en móvil desaparece del nav y no hay hamburguesa**. Se pierde navegación clave.
- **Sin indicador de ruta activa.** No se distingue en qué página está el usuario.
- **Hero en móvil con caja vacía.** El "mock" decorativo ocupa altura sin aportar nada en pantallas chicas.
- **Resumen del cotizador no es sticky.** En desktop, al hacer scroll por la tabla de precios, el panel de total se va; debería quedar fijo (`sticky top-20`).
- **Ancho de contenido.** Todo a 1200px; bien, pero faltan límites de lectura (`max-w` en bloques de texto largos) en algunas secciones.

### Recomendaciones
- **Header responsive:** logo + hamburguesa en móvil con drawer/menú; en desktop nav horizontal con estado activo (`router-link-active`).
- **Hero:** sustituir la caja vacía por **imagen real de producto** (tenemos `.webp` reutilizables) o un mockup de uniforme con logo; en móvil, imagen debajo del texto con altura controlada.
- **Cotizador desktop:** panel de resumen `sticky`; en móvil, resumen como **barra inferior fija** ("$12,150 — Continuar") para que el total siempre esté a la vista.
- **Grid de catálogo:** ya usa `auto-fill minmax(220px)` (bien); verificar gutters y que no quede 1 sola columna estirada en breakpoints intermedios.

---

## 3. Tipografía

### Hallazgos
- Poppins en 400–800: correcto y profesional.
- **Escala poco sistemática:** tamaños vía `text-3xl sm:text-4xl` sueltos por página; falta una escala tipográfica definida y reutilizable (display / h1 / h2 / body / caption).
- **Pesos extremos repetidos** (`font-extrabold` en muchos sitios) restan elegancia. El minimalismo prefiere contraste por tamaño/espacio más que por peso.

### Recomendaciones
- Definir escala tipográfica en `tailwind.config` (p. ej. `text-display`, `text-h1`…) con `line-height` y `letter-spacing` afinados.
- Reservar `extrabold` para títulos principales; cuerpo en 400–500; subtítulos en 600.
- Mejorar interlineado en párrafos largos y limitar a ~65ch.

---

## 4. Color, contraste y accesibilidad (A11y)

### Hallazgos
- **Sin foco visible 🔴.** La clase `.btn` y los links no tienen `focus-visible` ring → navegación por teclado invisible (problema serio de accesibilidad).
- **Estado deshabilitado sin estilo 🟠.** El botón "Continuar al pedido" usa `:disabled` pero se ve idéntico al activo (sigue lima brillante). Confunde.
- **Chips/pills como tap targets pequeños 🟠.** `px-2.5 py-0.5` queda por debajo del mínimo recomendado (~44px) para tocar cómodo en móvil.
- **Contraste a revisar:** texto `sub` (`#cdd3f7`) sobre superficies translúcidas claras puede bajar de AA; lila `#9D81FC` como texto pequeño es limítrofe.
- **Sin `prefers-reduced-motion`.** Las transiciones/hover no se desactivan para usuarios sensibles al movimiento.
- **Inputs sin estados de error/ayuda.** No hay mensajes de validación ni `aria-*`.

### Recomendaciones
- Añadir `:focus-visible` con anillo lila a `.btn`, links, inputs y chips.
- Estilo `:disabled` real (opacidad + `cursor-not-allowed` + sin sombra).
- Agrandar áreas táctiles de chips de filtro a ≥40px de alto.
- Verificar todos los textos a **contraste AA**; ajustar `sub` si no pasa.
- Respetar `prefers-reduced-motion`.
- Mensajes de validación accesibles (`aria-describedby`, `aria-invalid`).

---

## 5. Navegación e arquitectura de información

### Hallazgos
- **Sin breadcrumbs** en páginas internas (el catálogo original sí tenía; se perdió).
- **CTA difuso.** Header tiene 3 acciones ("Catálogo", "Cotizar", "Portal B2B") con jerarquía poco clara.
- **Footer mínimo:** sin datos de contacto, horarios, dirección, redes ni enlaces legales (clave para confianza B2B).
- **Sin página de producto** (`producto/[id]`) aún (los enlaces del catálogo van todos al cotizador).

### Recomendaciones
- Header: 1 acción primaria clara (**"Cotizar"** lima) + accesos secundarios discretos; estado activo.
- Footer corporativo: contacto (tel/WhatsApp/correo reales), dirección, horario, redes, aviso de privacidad/términos.
- Breadcrumb ligero en internas.
- Ficha de producto con galería, descripción, tabla de precios y CTA a cotizar esa prenda.

---

## 6. Componentes — hallazgos puntuales

### Header (`TheHeader.vue`)
- 🔴 Sin menú móvil (catálogo oculto en móvil). 🟠 Sin ruta activa. 🟠 3 CTAs sin jerarquía.

### Hero (`index.vue`)
- 🟠 Caja decorativa vacía en lugar de producto. 🟠 Sin prueba social (logos de clientes, "+X empresas confían").

### Cotizador (`cotizador.vue`)
- 🟠 Uploader sin **preview** de imagen ni validación de tipo/peso (acepta `.ai` que no se puede previsualizar → aclarar).
- 🟠 Input numérico sin límites/validación (permite 0, negativos vía teclado, cantidades absurdas).
- 🟠 Resumen no sticky; en móvil el total queda lejos del scroll.
- 🟢 La tabla de precios con resaltado de fila activa es un acierto (mantener).

### Catálogo (`catalogo.vue`)
- 🟠 Tarjetas con thumbnail vacío (gradiente) → se ve "sin terminar". 🟠 Sin buscador/orden. 🟠 Sin estado "0 resultados".

### Login (`login.vue`)
- 🟠 Sin toggle de contraseña, sin "¿olvidaste tu contraseña?", sin enlace a registro de empresa, sin validación.

### Footer (`TheFooter.vue`)
- 🟠 Demasiado escueto para B2B; falta contacto/legal/confianza.

### Global
- 🔴 Foco no visible. 🟠 Sin estados loading/empty/error. 🟠 Sin favicon/OG image. 🟠 Muchos `style=` inline (mantenibilidad y consistencia).

---

## 7. Estados, feedback y micro-interacciones

### Hallazgos
- No hay **skeletons** ni spinners (importante cuando Supabase cargue datos).
- No hay **toasts/confirmaciones** (ej. "logo subido", "cotización lista").
- Transiciones solo en hover de cards/botones; faltan transiciones de entrada suaves y consistentes.

### Recomendaciones
- Skeletons para catálogo/portal; spinner en botones al enviar.
- Toast system para feedback de acciones.
- Animaciones discretas (fade/slide cortos), respetando `reduced-motion`.

---

## 8. Performance y percepción

### Hallazgos
- Imágenes `.webp` (bien), pero algunas pesan ~1MB (`gyomei` 1MB) → optimizar/responsive `srcset`.
- Fuentes Google por `<link>`: ok, pero conviene `font-display: swap` (ya incluido) y precargar la variante principal.
- `background-attachment: fixed` en `body` puede causar jank en móvil → revisar.

### Recomendaciones
- `<NuxtImg>` (módulo `@nuxt/image`) con `sizes`/`srcset` y lazy-load.
- Quitar `background-attachment: fixed` en móvil.
- Auditar con Lighthouse (meta: ≥95 en Performance/Best Practices/SEO/A11y).

---

## 9. Confianza / profesionalismo B2B (lo que cierra ventas)

Un comprador corporativo evalúa señales de seriedad. Hoy faltan casi todas:
- Logos de empresas cliente / testimonios con nombre y cargo.
- Datos de contacto reales y visibles (tel, WhatsApp, correo, dirección).
- Tiempos de entrega, política de mínimos, métodos de pago (Stripe/transferencia), factura/CFDI.
- Página "Nosotros" / portafolio de trabajos (uniformes reales con logos).
- Aviso de privacidad y términos (obligatorio en MX para datos personales).

---

## 10. Plan de mejoras priorizado

### 🔴 P0 — Imprescindibles (impacto alto, esfuerzo bajo-medio) — ~1.5–2 días
1. **Header responsive con menú móvil** + estado de ruta activa.
2. **Foco visible** (`focus-visible`) en botones/links/inputs/chips + estilo `:disabled` real.
3. **Sistema de tokens de superficie/sombra** y limpieza de `style=` inline (consistencia).
4. **Bajar el ruido visual:** un solo gradiente sutil + regla del acento lima único por vista.
5. **Resumen del cotizador sticky** (desktop) / **barra de total fija** (móvil).
6. **Validación e input numérico robusto** + estado deshabilitado claro en el cotizador.

### 🟠 P1 — Alto valor (look profesional + confianza) — ~2–3 días
7. **Hero con imagen real** de producto/mockup + bloque de prueba social.
8. **Catálogo con fotos reales** (o placeholders elegantes uniformes) + buscador/orden + estado "0 resultados".
9. **Uploader de logo con preview** y validación de tipo/peso + mensajes accesibles.
10. **Footer corporativo** (contacto real, redes, legal) + breadcrumbs en internas.
11. **Escala tipográfica** sistematizada y pesos más sobrios.
12. **Estados de carga/vacío/error** base (skeletons + toasts).

### 🟢 P2 — Pulido fino — ~1–2 días
13. **Ficha de producto** (`producto/[id]`) con galería y CTA a cotizar.
14. **Login completo** (toggle password, registro, recuperar contraseña — UI lista para Supabase Auth).
15. **Optimización de imágenes** (`@nuxt/image`, srcset) + quitar `bg fixed` en móvil.
16. **Micro-interacciones** suaves + `prefers-reduced-motion`.
17. **Favicon, app icons y OG image**; meta SEO por página.
18. **Auditoría Lighthouse** y ajustes finales de contraste AA.

**Estimación total:** ~5–7 días de trabajo enfocado.

---

## 11. Decisión estratégica que necesito de ti

La meta "minimalista y 100% profesional" sugiere **bajar la intensidad** del tema actual (menos neón, menos gradientes). Tengo dos caminos:

- **A) Refinar el tema oscuro actual** → mantener morado/lima pero depurado, minimalista, con el lima como acento escaso. (Conserva identidad, look moderno premium.)
- **B) Tema claro/corporativo** → fondo claro, tipografía oscura, lila/lima solo como acentos. (Más "proveedor serio tradicional", máxima legibilidad.)

> Mi recomendación: **A (oscuro refinado)** — conserva tu identidad y, bien depurado, se ve premium y profesional sin perder personalidad. Pero si tu cliente objetivo es muy corporativo/conservador, **B** transmite más formalidad.
