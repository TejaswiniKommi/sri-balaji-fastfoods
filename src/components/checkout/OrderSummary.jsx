import PriceBreakdown from '../cart/PriceBreakdown'
import { getVariantLabel } from '../../data/categories'
import { formatPrice } from '../../utils/format'

/** Read-only list of ordered items with totals. `children` renders below (e.g. the Place Order button). */
export default function OrderSummary({ items, subtotal, deliveryFee, total, fulfillment, title = 'Order summary', children }) {
  return (
    <section aria-labelledby="order-summary-title" className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
      <h2 id="order-summary-title" className="text-2xl font-extrabold text-ink">{title}</h2>
      <ul className="my-4 divide-y divide-cream-200">
        {items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-bold text-ink">
                {item.name} × {item.quantity}
              </p>
              <p className="text-sm text-ink-muted">
                {item.variant && `${getVariantLabel(item.variant).en}, `}
                {formatPrice(item.price)} each
              </p>
              {item.nameTe && <p lang="te" className="font-telugu text-sm text-ink-soft">{item.nameTe}</p>}
            </div>
            <p className="shrink-0 font-bold text-ink">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <PriceBreakdown subtotal={subtotal} deliveryFee={deliveryFee} total={total} fulfillment={fulfillment} />
      {children && <div className="mt-5">{children}</div>}
    </section>
  )
}
