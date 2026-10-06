import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ShoppingCart } from 'lucide-react'
import FoodImage from './FoodImage'
import Button from '../ui/Button'
import QuantitySelector from '../ui/QuantitySelector'
import useCart from '../../hooks/useCart'
import { getCategoryMeta, getVariantLabel } from '../../data/categories'
import { formatPrice, hasPrice, PRICE_TBC } from '../../utils/format'

/** Reusable menu card. Horizontal on phones (easy to scan), vertical from tablet up. */
export default function FoodCard({ food }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const category = getCategoryMeta(food.category)
  const orderable = hasPrice(food) && food.available !== false
  const detailsPath = `/menu/${food.id}`

  function handleAdd() {
    addItem(food, quantity)
    setQuantity(1)
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex sm:flex-col">
        <Link to={detailsPath} tabIndex={-1} aria-hidden="true" className="relative block w-28 shrink-0 sm:w-full">
          <FoodImage food={food} showCaption={false} className="h-full min-h-36 w-full sm:h-44" />
          {food.variant && (
            <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-brand-700 shadow">
              {getVariantLabel(food.variant).en}
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <p className="text-sm font-bold text-saffron-700">{category.label}</p>
          <h3 className="text-xl font-bold leading-tight text-ink">
            <Link to={detailsPath} className="hover:text-brand-600 focus-visible:underline">
              {food.name}
            </Link>
          </h3>
          {food.nameTe && (
            <p lang="te" className="font-telugu text-base text-ink-soft">
              {food.nameTe}
            </p>
          )}
          {food.description && <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{food.description}</p>}
          <p className={`mt-2 font-display font-extrabold ${hasPrice(food) ? 'text-2xl text-brand-600' : 'text-base text-ink-muted'}`}>
            {hasPrice(food) ? formatPrice(food.price) : PRICE_TBC}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
        {orderable ? (
          <>
            <QuantitySelector value={quantity} onChange={setQuantity} label={`${food.name} quantity`} />
            <Button
              variant={added ? 'success' : 'primary'}
              size="sm"
              className="flex-1"
              onClick={handleAdd}
              aria-label={`Add ${quantity} ${food.name} to cart`}
            >
              {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
              {added ? 'Added' : 'Add to Cart'}
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" className="w-full border-2 border-cream-200" disabled>
            {food.available === false ? 'Currently unavailable' : 'Price to be confirmed'}
          </Button>
        )}
      </div>
    </article>
  )
}
