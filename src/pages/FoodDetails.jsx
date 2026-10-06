import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronLeft, ShoppingCart } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import QuantitySelector from '../components/ui/QuantitySelector'
import FoodImage from '../components/food/FoodImage'
import FoodGrid from '../components/food/FoodGrid'
import useFoodDetails from '../hooks/useFoodDetails'
import useFoods from '../hooks/useFoods'
import useCart from '../hooks/useCart'
import { getCategoryMeta, getVariantLabel } from '../data/categories'
import { formatPrice, hasPrice, PRICE_TBC } from '../utils/format'

export default function FoodDetails() {
  const { id } = useParams()
  const { food, loading, error, reload } = useFoodDetails(id)
  const { foods } = useFoods()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (loading) return <Container><Spinner label="Loading item…" /></Container>

  if (error) {
    return (
      <Container className="py-12">
        {error.status === 404 ? (
          <EmptyState icon="🔎" title="We couldn't find that item" message="It may have been removed from the menu.">
            <Button to="/menu">Back to menu</Button>
          </EmptyState>
        ) : (
          <ErrorMessage error={error} title="We couldn't load this item" onRetry={reload} />
        )}
      </Container>
    )
  }

  const category = getCategoryMeta(food.category)
  const orderable = hasPrice(food) && food.available !== false
  const related = foods.filter((f) => f.category === food.category && String(f.id) !== String(food.id)).slice(0, 4)

  function handleAdd() {
    addItem(food, quantity)
    setAdded(true)
  }

  return (
    <Container className="py-6 sm:py-10">
      <Link to="/menu" className="inline-flex min-h-11 items-center gap-1 font-bold text-brand-700 hover:underline">
        <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back to menu
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
        <FoodImage food={food} className="aspect-square w-full rounded-3xl shadow-card" />

        <div>
          <p className="font-bold text-saffron-700">
            {category.label}
            {food.variant && `, ${getVariantLabel(food.variant).en}`}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">{food.name}</h1>
          {food.nameTe && <p lang="te" className="mt-1 font-telugu text-2xl text-ink-soft">{food.nameTe}</p>}
          {food.variant && getVariantLabel(food.variant).te && (
            <p lang="te" className="font-telugu text-ink-muted">{getVariantLabel(food.variant).te}</p>
          )}

          <p className={`mt-5 font-display font-extrabold ${hasPrice(food) ? 'text-5xl text-brand-600' : 'text-2xl text-ink-muted'}`}>
            {hasPrice(food) ? formatPrice(food.price) : PRICE_TBC}
          </p>

          {food.description && <p className="mt-4 max-w-prose text-lg text-ink-soft">{food.description}</p>}

          <div className="mt-8">
            {orderable ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} label="quantity" />
                  <Button size="lg" onClick={handleAdd} className="flex-1 sm:flex-none">
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    Add to Cart ({formatPrice(food.price * quantity)})
                  </Button>
                </div>
                {added && (
                  <p role="status" className="mt-4 flex flex-wrap items-center gap-2 font-bold text-leaf-700">
                    <Check className="h-5 w-5" aria-hidden="true" /> Added to your cart.
                    <Link to="/cart" className="text-brand-700 underline-offset-4 hover:underline">View cart</Link>
                  </p>
                )}
              </>
            ) : (
              <p className="rounded-xl bg-cream-200 px-4 py-3 font-bold text-ink-soft">
                {food.available === false ? 'This item is currently unavailable.' : 'This item can be ordered once its price is confirmed.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-5 text-3xl font-extrabold text-ink">More {category.label.toLowerCase()}</h2>
          <FoodGrid foods={related} />
        </section>
      )}
    </Container>
  )
}
