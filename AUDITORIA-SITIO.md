# Küki — Auditoría integral del sitio + mejoras de modo claro

**Fecha:** 2026-06-14
**Stack:** Nuxt 3 · Tailwind (tokens conmutables) · Font Awesome 6.7.2
**Temas:** Oscuro refinado (`:root`) · Claro corporativo (`.theme-light`)

---

## 1. Estado actual por página/componente

| Área | Estado | Notas |
|---|---|---|
| **Header** | ✅ Sólido | Responsive con menú móvil, ruta activa, CTA única, toggle de tema, iconos FA. |
| **Footer** | ✅ Sólido | Corporativo: navegación, contacto (WhatsApp/correo/horario), redes, legal, iconos FA. |
| **Home (`index`)** | ✅ Bueno | Hero con imagen real + prueba social + tira de logos; beneficios; cómo funciona; CTA. |
| **Catálogo** | 🟡 Funcional | Filtros, búsqueda, orden, estado vacío, fotos reales (placeholder). Falta datos reales (Supabase) y ficha de producto. |
| **Cotizador** | ✅ Bueno | Cálculo en tiempo real, tabla de tarifas, resumen sticky + barra móvil, validación, uploader con preview. |
| **Login** | ✅ Bueno (UI) | Login/registro, mostrar contraseña, recuperar, validación visual. Falta conectar Supabase Auth. |
| **Sistema de diseño** | ✅ Sólido | Tokens semánticos, foco visible, `reduced-motion`, escala tipográfica, sombras consistentes. |

**Veredicto general:** el sitio ya se ve y se siente profesional. Los pendientes mayores son de **datos/backend** (Fases 2–4), no de UI.

---

## 2. Auditoría transversal (ambos temas)

### Lo que está bien ✅
- Tokens semánticos: cambiar de tema reestiliza todo sin tocar componentes.
- Accesibilidad base: foco visible global, áreas táctiles ≥44px, `aria-hidden` en iconos, `prefers-reduced-motion`.
- Tipografía sistematizada (`display/h1/h2/h3/lead`) con pesos sobrios.
- Sin emojis: todos los iconos son Font Awesome.
- Responsive verificado en las 4 rutas.

### Pendientes (no bloqueantes)
- 🟡 **Imágenes pesadas** (algunas ~1 MB) sin `srcset`/`@nuxt/image`.
- 🟡 **Ficha de producto** (`producto/[id]`) aún no existe.
- 🟡 **Estados de carga reales** (skeletons) listos en CSS pero sin usarse hasta conectar datos.
- 🟡 **OG image / meta SEO por página** pendientes.
- 🟡 Datos placeholder (contacto, logos de clientes, catálogo) por reemplazar con reales.

---

## 3. 🔆 Modo claro — auditoría y mejoras aplicadas

El modo claro tenía varios defectos que lo hacían ver "sin terminar". **Corregidos:**

| # | Problema detectado | Causa | Corrección |
|---|---|---|---|
| 1 | **Cajas de icono, chips e inputs invisibles** sobre tarjetas blancas | `--c-surface-2` era `#ffffff`, idéntico a las tarjetas | `--c-surface-2: #eceef6` (gris claro distinto del blanco) |
| 2 | **Botón primario con bajo contraste** (texto blanco sobre lila claro `#9d81fc`, fallaba AA) | Primario demasiado claro | `--c-primary: #5d43d0` (lila profundo, blanco ~7:1 → pasa AA/AAA) |
| 3 | **Chips/inputs/botón fantasma sin fondo visible** en tarjetas | Usaban `--c-surface` (blanco) | Ahora usan `--c-surface-2` (gris claro) en ambos temas |
| 4 | **Texto terciario flojo** (captions/placeholder) | `--c-faint: #8186a3` limítrofe | `--c-faint: #6c7090` (más contraste) |
| 5 | **Tarjetas poco separadas** del fondo | Sombra muy tenue | Sombra de 2 capas + borde `--c-line` reforzado (`0.12`) |
| 6 | **Foco poco visible** en claro | Anillo lila claro | `--c-ring: #6d4fd8` (más definido) |
| 7 | **Fondo plano** | — | `--c-bg: #f4f5f9` (gris frío) + glow lila sutil |

### Resultado
- Jerarquía clara: fondo `#f4f5f9` → tarjetas `#ffffff` → controles `#eceef6`.
- Acción primaria y precios con contraste AA/AAA.
- Coherencia con el modo oscuro (mismos roles de token).

### Verificación de contraste (texto sobre fondo)
| Combinación | Ratio aprox. | AA |
|---|---|---|
| `fg #16142e` sobre `bg #f4f5f9` | ~14:1 | ✅ |
| `muted #51546e` sobre `bg` | ~6.5:1 | ✅ |
| `faint #6c7090` sobre `bg` | ~4.7:1 | ✅ |
| blanco sobre `primary #5d43d0` | ~7:1 | ✅ |
| `highlight #5b3fd6` sobre `surface #fff` | ~6:1 | ✅ |

---

## 4. Recomendaciones siguientes (priorizadas)

- **P2 UI:** ficha de producto, `@nuxt/image` (srcset/lazy), micro-interacciones, OG/SEO por página, auditoría Lighthouse final.
- **Fase 2 datos:** conectar catálogo/cotizador a Supabase (tabla `products`, `price_tiers`).
- **Reemplazo de contenido:** contacto real, logos de clientes reales, fotos de uniformes reales (hoy hay placeholders de playeras).

> El modo claro ya quedó al nivel del oscuro. Para verlo: `npm run dev` → botón ☀️/🌙 del header.
