import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { formatPrice, plural } from '../../utils/format'

/** Mobile-only bar that keeps the cart one tap away while browsing. */
export default function StickyCartBar({ visible, itemCount, subtotal }) {
  if (!visible) return null
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 px-3 pt-2 md:hidden">
      <Link
        to="/cart"
        className="flex min-h-14 items-center justify-between rounded-2xl bg-brand-600 px-5 text-white shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2"
      >
        <span className="flex items-center gap-2 font-bold">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          View cart ({itemCount} {plural(itemCount, 'item', 'items')})
        </span>
        <span className="font-display text-xl font-extrabold">{formatPrice(subtotal)}</span>
      </Link>
    </div>
  )
}
