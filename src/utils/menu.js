import { CATEGORIES, getCategoryMeta } from '../data/categories'

/** Category ids present in the foods, ordered like data/categories.js (unknown ones last). */
export function getCategoryIds(foods) {
  const present = new Set(foods.map((f) => f.category))
  const ordered = CATEGORIES.map((c) => c.id).filter((id) => present.has(id))
  const extra = [...present].filter((id) => !ordered.includes(id))
  return [...ordered, ...extra]
}

/** [{ id, label, labelTe, emoji, tint, count, minPrice }] */
export function getCategorySummaries(foods) {
  return getCategoryIds(foods).map((id) => {
    const items = foods.filter((f) => f.category === id)
    const prices = items.map((f) => f.price).filter((p) => Number.isFinite(p))
    return {
      ...getCategoryMeta(id),
      count: items.length,
      minPrice: prices.length ? Math.min(...prices) : null,
    }
  })
}

export function groupByCategory(foods) {
  return getCategoryIds(foods).map((id) => ({
    category: getCategoryMeta(id),
    items: foods.filter((f) => f.category === id),
  }))
}

/** Case-insensitive match on English name, Telugu name, variant and category. */
export function matchesSearch(food, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [food.name, food.nameTe, food.variant, food.category]
    .filter(Boolean)
    .some((text) => text.toLowerCase().includes(q))
}
