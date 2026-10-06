import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import FoodImage from '../food/FoodImage'
import QuantitySelector from '../ui/QuantitySelector'
import { getVariantLabel } from '../../data/categories'
import { formatPrice } from '../../utils/format'

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <li className="flex gap-3 rounded-2xl bg-white p-3 shadow-card sm:gap-4 sm:p-4">
      <Link to={`/menu/${item.id}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <FoodImage food={item} showCaption={false} className="h-20 w-20 rounded-xl sm:h-24 sm:w-24" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-ink">
              {item.name}
              {item.variant && <span className="font-semibold text-ink-soft"> ({getVariantLabel(item.variant).en})</span>}
            </h3>
            {item.nameTe && <p lang="te" className="font-telugu text-sm text-ink-soft">{item.nameTe}</p>}
            <p className="text-sm text-ink-muted">{formatPrice(item.price)} each</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantitySelector value={item.quantity} onChange={(q) => onQuantityChange(item.id, q)} label={`${item.name} quantity`} />
          <p className="font-display text-xl font-extrabold text-brand-600">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </li>
  )
}
