// Display info for the categories that exist on the menu board.
// Order here = order shown on the site. Telugu labels are the words printed on the board.
export const CATEGORIES = [
  { id: 'Fried Rice', label: 'Fried Rice', labelTe: 'ఫ్రైడ్‌రైస్', emoji: '🍚', tint: 'bg-sun-100' },
  { id: 'Manchurian', label: 'Manchurian', labelTe: 'మంచూరియా', emoji: '🥘', tint: 'bg-brand-100' },
  { id: 'Noodles', label: 'Noodles', labelTe: 'నూడిల్స్', emoji: '🍜', tint: 'bg-saffron-100' },
]

export function getCategoryMeta(id) {
  return (
    CATEGORIES.find((c) => c.id === id) ?? {
      id,
      label: id,
      labelTe: '',
      emoji: '🍽️',
      tint: 'bg-cream-200',
    }
  )
}

// The fried rice section of the board has two rice types, each with its own prices.
export const VARIANT_LABELS = {
  Basmati: { en: 'Basmati Rice', te: 'బాస్మతి రైస్' },
  Masoor: { en: 'Masoor Rice', te: 'మసూర రైస్' },
}

export function getVariantLabel(variant) {
  return VARIANT_LABELS[variant] ?? { en: variant, te: '' }
}
