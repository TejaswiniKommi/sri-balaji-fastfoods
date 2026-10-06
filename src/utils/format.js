export const PRICE_TBC = 'Price to be confirmed'

export function hasPrice(food) {
  return food != null && Number.isFinite(food.price)
}

/** ₹120 (Indian digit grouping). Returns "Price to be confirmed" when price is null. */
export function formatPrice(price) {
  if (price === null || price === undefined || !Number.isFinite(price)) return PRICE_TBC
  return `₹${Number(price).toLocaleString('en-IN')}`
}

export function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return ''
  }
}

export function plural(n, one, many) {
  return n === 1 ? one : many
}
