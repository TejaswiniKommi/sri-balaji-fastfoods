import { Bike, Store } from 'lucide-react'

const options = [
  { value: 'delivery', label: 'Delivery', icon: Bike },
  { value: 'pickup', label: 'Pickup', icon: Store },
]

/** Delivery / Pickup selector shared by the cart and checkout pages. */
export default function FulfillmentToggle({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-1.5 font-bold text-ink">How would you like your order?</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value: v, label, icon: Icon }) => {
          const selected = value === v
          return (
            <label
              key={v}
              className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 px-3 font-bold transition focus-within:ring-2 focus-within:ring-brand-600 focus-within:ring-offset-2 ${selected ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-cream-200 bg-white text-ink hover:border-brand-300'}`}
            >
              <input type="radio" name="fulfillment" value={v} checked={selected} onChange={() => onChange(v)} className="sr-only" />
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
