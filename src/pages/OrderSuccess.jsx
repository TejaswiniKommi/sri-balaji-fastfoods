import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CircleCheck, Info } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import OrderSummary from '../components/checkout/OrderSummary'
import { STORAGE_KEYS } from '../data/config'
import { formatDateTime } from '../utils/format'
import { getOrderById } from '../services/orderService'

function readSavedOrder() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.lastOrder)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function OrderSuccess() {
  const { state } = useLocation()
  const [order, setOrder] = useState(state?.order ?? readSavedOrder())

  if (!order) {
    return (
      <Container className="py-12">
        <EmptyState icon="🧾" title="No recent order found" message="Place an order from the menu and it will appear here.">
          <Button to="/menu">Browse menu</Button>
        </EmptyState>
      </Container>
    )
  }

  const details = [
    ['Name', order.customerName],
    ['Mobile', order.mobile],
    ['Order type', order.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'],
    ...(order.fulfillment === 'delivery' ? [['Address', order.address]] : []),
    ...(order.notes ? [['Notes', order.notes]] : []),
    ['Placed', formatDateTime(order.createdAt)],
  ]

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100 text-leaf-600">
            <CircleCheck className="h-12 w-12" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl" tabIndex={-1}>Order placed successfully!</h1>
          <p className="mt-4 text-ink-soft">Your order number</p>
          <p className="mx-auto mt-1 w-fit rounded-xl bg-sun-100 px-6 py-2 font-display text-3xl font-extrabold tracking-wide text-ink">
            {order.orderNumber}
          </p>
        </div>

        {order.isMock && (
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-saffron-100 px-4 py-3 text-saffron-700">
            <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">Demo order: it was not sent to the restaurant because the order system is not connected yet.</span>
          </p>
        )}

        <div className="mt-8 space-y-6">
          <OrderSummary
            title="Items ordered"
           items={(order.items || []).map((item) => ({
  ...item,
  name: item.name ?? item.foodName,
}))}
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            total={order.total}
            fulfillment={order.fulfillment}
          />

          <section aria-labelledby="customer-title" className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <h2 id="customer-title" className="text-2xl font-extrabold text-ink">Customer information</h2>
            <dl className="mt-3 divide-y divide-cream-200">
              {details.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
                  <dt className="w-28 shrink-0 font-bold text-ink-soft">{label}</dt>
                  <dd className="break-words text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Button to="/menu" size="lg">Continue Shopping</Button>
        </div>
      </div>
    </Container>
  )
}
