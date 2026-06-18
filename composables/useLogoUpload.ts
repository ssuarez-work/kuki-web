import { MAX_LOGO_BYTES } from '~/utils/business'

export function useLogoUpload() {
  const file = ref<File | null>(null)
  const name = ref('')
  const preview = ref('')
  const error = ref('')

  function reset() {
    file.value = null
    name.value = ''
    preview.value = ''
    error.value = ''
  }

  function select(event: Event) {
    reset()
    const selected = (event.target as HTMLInputElement).files?.[0]
    if (!selected) return
    if (selected.size > MAX_LOGO_BYTES) {
      error.value = 'El archivo supera los 10 MB.'
      return
    }
    name.value = selected.name
    file.value = selected
    if (selected.type.startsWith('image/') && selected.type !== 'application/postscript') {
      preview.value = URL.createObjectURL(selected)
    }
  }

  return { file, name, preview, error, select, reset }
}
