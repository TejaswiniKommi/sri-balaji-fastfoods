import { Minus, Plus } from 'lucide-react'

const btn =
  'flex h-11 w-10 items-center justify-center text-brand-700 transition hover:bg-brand-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-35'

export default function QuantitySelector({ value, onChange, min = 1, max = 99, label = 'quantity' }) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-xl border-2 border-cream-200 bg-white">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-base font-extrabold text-ink">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
