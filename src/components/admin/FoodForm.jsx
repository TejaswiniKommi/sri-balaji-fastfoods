import { useState } from 'react'
import Button from '../ui/Button'
import TextField from '../ui/TextField'
import { CATEGORIES, VARIANT_LABELS } from '../../data/categories'

const selectClass =
  'block w-full rounded-xl border-2 border-cream-200 bg-white px-4 py-3 text-base text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30'

/** Add / edit form for a food item. Calls onSubmit(food) with values in the UI food shape. */
export default function FoodForm({ initial, categoryIds = [], onSubmit, onCancel, saving, error }) {
  const [v, setV] = useState(() => ({
    name: initial?.name ?? '',
    nameTe: initial?.nameTe ?? '',
    category: initial?.category ?? CATEGORIES[0].id,
    variant: initial?.variant ?? '',
    price: initial?.price == null ? '' : String(initial.price),
    description: initial?.description ?? '',
    image: initial?.image ?? '',
    available: initial?.available ?? true,
    featured: initial?.featured ?? false,
  }))
  const [errors, setErrors] = useState({})

  const categories = [...new Set([...CATEGORIES.map((c) => c.id), ...categoryIds, v.category])]
  const variants = [...new Set([...Object.keys(VARIANT_LABELS), v.variant].filter(Boolean))]

  const set = (field) => (e) => {
    setV((s) => ({ ...s, [field]: e.target.value }))
    if (errors[field]) setErrors((x) => ({ ...x, [field]: undefined }))
  }
  const toggle = (field) => (e) => setV((s) => ({ ...s, [field]: e.target.checked }))

  function handleSubmit(e) {
    e.preventDefault()
    const found = {}
    if (!v.name.trim()) found.name = 'Enter the food name.'
    if (!v.category) found.category = 'Choose a category.'
    if (v.price.trim() !== '' && (!Number.isFinite(Number(v.price)) || Number(v.price) < 0)) found.price = 'Enter a price of 0 or more, or leave blank.'
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`food-${first}`)?.focus()
      return
    }
    onSubmit({
      name: v.name.trim(),
      nameTe: v.nameTe.trim(),
      category: v.category,
      variant: v.variant,
      price: v.price.trim() === '' ? null : Number(v.price),
      description: v.description.trim(),
      image: v.image.trim(),
      available: v.available,
      featured: v.featured,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField id="food-name" label="Food name" required value={v.name} onChange={set('name')} error={errors.name} placeholder="e.g. Veg Fried Rice" />
      <TextField id="food-nameTe" label="Telugu name" lang="te" value={v.nameTe} onChange={set('nameTe')} placeholder="As written on the menu board" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="food-category" className="mb-1.5 block font-bold text-ink">Category <span className="text-brand-600" aria-hidden="true">*</span></label>
          <select id="food-category" value={v.category} onChange={set('category')} className={selectClass}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="food-variant" className="mb-1.5 block font-bold text-ink">Rice type <span className="font-normal text-ink-muted">(optional)</span></label>
          <select id="food-variant" value={v.variant} onChange={set('variant')} className={selectClass}>
            <option value="">Not applicable</option>
            {variants.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
      </div>

      <TextField
        id="food-price"
        label="Price (₹)"
        type="number"
        inputMode="decimal"
        min="0"
        step="1"
        value={v.price}
        onChange={set('price')}
        error={errors.price}
        hint="Leave blank to show “Price to be confirmed”. The item can't be ordered until a price is set."
      />
      <TextField id="food-description" label="Description" multiline value={v.description} onChange={set('description')} />
      <TextField id="food-image" label="Image URL" type="url" value={v.image} onChange={set('image')} placeholder="https://… or /images/name.jpg" hint="Leave blank to show the “Photo coming soon” placeholder." />

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex min-h-11 items-center gap-2 font-semibold text-ink">
          <input type="checkbox" checked={v.available} onChange={toggle('available')} className="h-5 w-5 accent-brand-600" /> Available to order
        </label>
        <label className="flex min-h-11 items-center gap-2 font-semibold text-ink">
          <input type="checkbox" checked={v.featured} onChange={toggle('featured')} className="h-5 w-5 accent-brand-600" /> Show in featured items
        </label>
      </div>

      {error && <p role="alert" className="rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-800">{error}</p>}

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Save changes' : 'Add food'}</Button>
      </div>
    </form>
  )
}
