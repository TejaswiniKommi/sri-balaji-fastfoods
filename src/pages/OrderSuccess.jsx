
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

const ORDER_STEPS = [
  { value: 'NEW', label: 'Order received' },
  { value: 'ACCEPTED', label: 'Order accepted' },
  { value: 'PREPARING', label: 'Preparing food' },
  { value: 'READY', label: 'Food is ready' },
  { value: 'DELIVERED', label: 'Delivered' },
]

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
  const [order, setOrder] = useState(
    state?.order ?? readSavedOrder()
  )

  // Refresh the current order from the backend every 5 seconds.
  useEffect(() => {
    const orderId = order?.id

    if (!orderId || order.isMock || order.status === 'DELIVERED') {
      return
    }

    let active = true

    async function refreshOrderStatus() {
      try {
        const latest = await getOrderById(orderId)

        if (!active) return

        setOrder((current) => {
          if (!current) return current

          const updated = {
            ...current,
            status: latest.status ?? current.status,
            paymentStatus:
              latest.paymentStatus ?? current.paymentStatus,
          }

          try {
            sessionStorage.setItem(
              STORAGE_KEYS.lastOrder,
              JSON.stringify(updated)
            )
          } catch {
            // Tracking still works if session storage is unavailable.
          }

          return updated
        })
      } catch (error) {
        console.error('Could not refresh customer order:', error)
      }
    }

    refreshOrderStatus()

    const interval = window.setInterval(refreshOrderStatus, 5000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [order?.id, order?.isMock, order?.status])

  if (!order) {
    return (
      <Container className="py-12">
        <EmptyState
          icon="🧾"
          title="No recent order found"
          message="Place an order from the menu and it will appear here."
        >
          <Button to="/menu">Browse menu</Button>
        </EmptyState>
      </Container>
    )
  }

  const currentStatus = String(order.status || 'NEW').toUpperCase()
  const currentIndex = ORDER_STEPS.findIndex(
    (step) => step.value === currentStatus
  )
  const paymentStatus = String(
    order.paymentStatus || 'PENDING'
  ).toUpperCase()

  const fulfillment =
    order.fulfillment?.toLowerCase() === 'pickup' ||
    order.orderType?.toLowerCase() === 'pickup'
      ? 'pickup'
      : 'delivery'

  const details = [
    ['Name', order.customerName],
    ['Mobile', order.mobile ?? order.mobileNumber],
    ['Order type', fulfillment === 'pickup' ? 'Pickup' : 'Delivery'],
    ...(fulfillment === 'delivery' ? [['Address', order.address]] : []),
    ...(order.notes ? [['Notes', order.notes]] : []),
    ['Placed', formatDateTime(order.createdAt ?? order.orderDate)],
  ]

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100 text-leaf-600">
            <CircleCheck className="h-12 w-12" aria-hidden="true" />
          </span>

          <h1
            className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl"
            tabIndex={-1}
          >
            Order placed successfully!
          </h1>

          <p className="mt-4 text-ink-soft">Your order number</p>

          <p className="mx-auto mt-1 w-fit rounded-xl bg-sun-100 px-6 py-2 font-display text-3xl font-extrabold tracking-wide text-ink">
            {order.orderNumber || `SBF-${order.id}`}
          </p>
        </div>

        {order.isMock && (
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-saffron-100 px-4 py-3 text-saffron-700">
            <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">
              Demo order: it was not sent to the restaurant because the order system is not connected yet.
            </span>
          </p>
        )}

        <section
          aria-labelledby="tracking-title"
          className="mt-8 rounded-3xl bg-white p-5 shadow-card sm:p-6"
        >
          <h2
            id="tracking-title"
            className="text-2xl font-extrabold text-ink"
          >
            Track your order
          </h2>

          <p className="mt-1 text-sm text-ink-soft">
            Your order status refreshes automatically.
          </p>

          <div className="mt-4 rounded-xl bg-cream-50 p-4">
            <p className="font-bold text-ink">
              Food status:{' '}
              <span className="text-brand-700">
                {currentStatus.replaceAll('_', ' ')}
              </span>
            </p>

            <p className="mt-2 font-bold text-ink">
              Payment status:{' '}
              <span
                className={
                  paymentStatus === 'PAID'
                    ? 'text-green-700'
                    : 'text-orange-700'
                }
              >
                {paymentStatus}
              </span>
            </p>
          </div>

          <ol className="mt-5 space-y-3">
            {ORDER_STEPS.map((step, index) => {
              const completed =
                currentIndex >= index && currentIndex !== -1
              const current = currentStatus === step.value

              return (
                <li
                  key={step.value}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${
                    current
                      ? 'border-brand-600 bg-brand-50'
                      : completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-cream-200 bg-white'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold ${
                      completed
                        ? 'bg-green-600 text-white'
                        : 'bg-cream-100 text-ink-soft'
                    }`}
                  >
                    {completed ? '✓' : index + 1}
                  </span>

                  <span
                    className={`font-semibold ${
                      current ? 'text-brand-700' : 'text-ink'
                    }`}
                  >
                    {step.label}
                    {current ? ' — Current status' : ''}
                  </span>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="mt-8 space-y-6">
          <OrderSummary
            title="Items ordered"
            items={(order.items || []).map((item) => ({
              ...item,
              name: item.name ?? item.foodName,
            }))}
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            total={order.total ?? order.totalAmount}
            fulfillment={fulfillment}
          />

          <section
            aria-labelledby="customer-title"
            className="rounded-3xl bg-white p-5 shadow-card sm:p-6"
          >
            <h2
              id="customer-title"
              className="text-2xl font-extrabold text-ink"
            >
              Customer information
            </h2>

            <dl className="mt-3 divide-y divide-cream-200">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4"
                >
                  <dt className="w-28 shrink-0 font-bold text-ink-soft">
                    {label}
                  </dt>
                  <dd className="break-words text-ink">
                    {value || '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Button to="/menu" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </Container>
  )
}
