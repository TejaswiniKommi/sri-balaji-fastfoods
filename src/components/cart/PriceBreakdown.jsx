import { formatPrice } from '../../utils/format'

/** Subtotal / delivery fee / grand total rows. Used on cart, checkout and order success. */
export default function PriceBreakdown({ subtotal, deliveryFee, total, fulfillment }) {
  return (
    <dl className="space-y-2">
      <div className="flex justify-between text-ink-soft">
        <dt>Subtotal</dt>
        <dd className="font-bold text-ink">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-ink-soft">
        <dt>{fulfillment === 'pickup' ? 'Delivery fee (pickup order)' : 'Delivery fee'}</dt>
        <dd className="font-bold text-ink">{formatPrice(deliveryFee)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t-2 border-dashed border-cream-200 pt-3">
        <dt className="text-lg font-extrabold text-ink">Grand total</dt>
        <dd className="font-display text-3xl font-extrabold text-brand-600">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}
