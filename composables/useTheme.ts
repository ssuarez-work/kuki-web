// Manejo del tema (oscuro refinado <-> claro corporativo), persistido en localStorage.
export type ThemeName = 'dark' | 'light'

export function useTheme() {
  const theme = useState<ThemeName>('theme', () => 'dark')

  function apply(t: ThemeName) {
    if (import.meta.client) {
      document.documentElement.classList.toggle('theme-light', t === 'light')
      localStorage.setItem('kuki-theme', t)
    }
  }

  function setTheme(t: ThemeName) {
    theme.value = t
    apply(t)
  }

  function toggle() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Sincroniza el estado con lo aplicado por el script inline al cargar.
  function init() {
    if (import.meta.client) {
      theme.value = document.documentElement.classList.contains('theme-light') ? 'light' : 'dark'
    }
  }

  return { theme, setTheme, toggle, init }
}
