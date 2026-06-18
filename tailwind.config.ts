import type { Config } from 'tailwindcss'

// Sistema de tokens semánticos (conmutables entre tema oscuro y claro vía variables CSS,
// definidas en assets/css/tailwind.css). Los colores de marca lila/lima se conservan.
export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Tokens semánticos (cambian según el tema activo)
        bg: 'var(--c-bg)',
        fg: 'var(--c-fg)', // texto principal
        muted: 'var(--c-muted)', // texto secundario
        faint: 'var(--c-faint)', // texto terciario / captions
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        line: 'var(--c-line)', // bordes / divisores
        primary: 'var(--c-primary)', // acción primaria
        'primary-ink': 'var(--c-primary-ink)', // texto sobre primary
        highlight: 'var(--c-highlight)', // dato clave (precio/total)
        ring: 'var(--c-ring)', // foco
        // Marca literal (para usos puntuales / modificadores de opacidad)
        brand: '#9D81FC',
        accent: '#D1FA30',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Escala tipográfica sistematizada
        display: ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['clamp(1.35rem, 2.4vw, 1.75rem)', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        lead: ['clamp(1rem, 1.5vw, 1.15rem)', { lineHeight: '1.6' }],
      },
      borderRadius: {
        brand: '14px',
        'brand-lg': '22px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
      },
      maxWidth: {
        container: '1200px',
        prose: '65ch',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
