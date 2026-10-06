import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import CartItem from '../components/cart/CartItem'
import FulfillmentToggle from '../components/cart/FulfillmentToggle'
import PriceBreakdown from '../components/cart/PriceBreakdown'
import useCart from '../hooks/useCart'
import { plural } from '../utils/format'

export default function Cart() {
  const { items, itemCount, subtotal, deliveryFee, total, fulfillment, setFulfillment, setQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState icon="🛒" title="Your cart is empty" message="Add something tasty from the menu to get started.">
          <Button to="/menu">Browse menu</Button>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Your cart</h1>
        <p className="font-semibold text-ink-soft">{itemCount} {plural(itemCount, 'item', 'items')}</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <ul className="space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onQuantityChange={setQuantity} onRemove={removeItem} />
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button to="/menu" variant="outline" size="sm">Add more items</Button>
            <Button variant="ghost" size="sm" onClick={clearCart}>Empty cart</Button>
          </div>
        </div>

        <aside aria-label="Order total" className="space-y-5 rounded-3xl bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
          <FulfillmentToggle value={fulfillment} onChange={setFulfillment} />
          <PriceBreakdown subtotal={subtotal} deliveryFee={deliveryFee} total={total} fulfillment={fulfillment} />
          <Button to="/checkout" size="lg" className="w-full">Proceed to Checkout</Button>
        </aside>
      </div>
    </Container>
  )
}
