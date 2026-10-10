
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import useCart from '../hooks/useCart'
import { placeOrder } from '../services/orderService'
import { API_BASE_URL, STORAGE_KEYS } from '../data/config'

function normalizeMobile(input) {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

function validate(values, fulfillment) {
  const errors = {}

  if (values.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your name.'
  }

  if (!/^[6-9]\d{9}$/.test(normalizeMobile(values.mobile))) {
    errors.mobile = 'Enter a valid 10-digit mobile number.'
  }

  if (fulfillment === 'delivery' && values.address.trim().length < 5) {
    errors.address = 'Please enter your delivery address.'
  }

  return errors
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

async function readResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage)
  }

  return data
}

export default function Checkout() {
  const navigate = useNavigate()

  const {
    items,
    subtotal,
    deliveryFee,
    total,
    fulfillment,
    setFulfillment,
    clearCart,
  } = useCart()

  const [values, setValues] = useState({
    customerName: '',
    mobile: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  if (items.length === 0 && !submitting) {
    return (
      <Container className="py-12">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some items before checking out."
        >
          <Button to="/menu">Browse menu</Button>
        </EmptyState>
      </Container>
    )
  }

  function handleChange(field, value) {
    setValues((current) => ({ ...current, [field]: value }))

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const found = validate(values, fulfillment)
    setErrors(found)

    const firstInvalid = Object.keys(found)[0]

    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus()
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const loaded = await loadRazorpayScript()

      if (!loaded) {
        throw new Error('Could not load Razorpay. Please check your internet connection.')
      }

      // Save the existing food order in your backend.
      const order = await placeOrder({
        customerName: values.customerName.trim(),
        mobile: normalizeMobile(values.mobile),
        fulfillment,
        address: fulfillment === 'delivery' ? values.address.trim() : '',
        notes: values.notes.trim(),
        items,
        subtotal,
        deliveryFee,
        total,
      })

      if (!order.id) {
        throw new Error('The order was saved without an order ID. Please contact the shop.')
      }

      // Ask Spring Boot to create a Razorpay payment order.
      const createResponse = await fetch(
        `${API_BASE_URL}/api/payments/create-order/${order.id}`,
        { method: 'POST' }
      )

      const paymentOrder = await readResponse(
        createResponse,
        'Could not start the online payment.'
      )

      // Open Razorpay Checkout and wait for server-side verification.
      await new Promise((resolve, reject) => {
        let settled = false

        function fail(error) {
          if (settled) return
          settled = true
          reject(error)
        }

        async function verifyPayment(paymentResponse) {
          try {
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/payments/verify/${order.id}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentResponse),
              }
            )

            const verified = await readResponse(
              verifyResponse,
              'Payment verification failed. Please contact the shop before retrying.'
            )

            if (verified.paymentStatus !== 'PAID') {
              throw new Error('Payment has not been confirmed by the server.')
            }

            if (settled) return
            settled = true
            resolve()
          } catch (error) {
            fail(error)
          }
        }

        try {
          const checkout = new window.Razorpay({
            key: paymentOrder.keyId,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency,
            order_id: paymentOrder.razorpayOrderId,
            name: 'Sri Balaji Fastfoods',
            description: `Food order #${order.id}`,
            prefill: {
              name: values.customerName.trim(),
              contact: normalizeMobile(values.mobile),
            },
            notes: {
              appOrderId: String(order.id),
            },
            theme: { color: '#c62818' },
            handler: verifyPayment,
            modal: {
              ondismiss: () => {
                fail(new Error('Payment window closed. Your payment is not confirmed.'))
              },
            },
          })

          checkout.on('payment.failed', (result) => {
            fail(
              new Error(
                result.error?.description || 'Payment failed. Please try again.'
              )
            )
          })

          checkout.open()
        } catch (error) {
          fail(error)
        }
      })

      const paidOrder = {
        ...order,
        paymentStatus: 'PAID',
      }

      try {
        sessionStorage.setItem(
          STORAGE_KEYS.lastOrder,
          JSON.stringify(paidOrder)
        )
      } catch {
        // Continue to the success page even if session storage is unavailable.
      }

      clearCart()
      navigate('/order-success', {
        replace: true,
        state: { order: paidOrder },
      })
    } catch (error) {
      setSubmitError(error)
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
        Checkout
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <CheckoutForm
          values={values}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          fulfillment={fulfillment}
          onFulfillmentChange={setFulfillment}
        />

        <div className="lg:sticky lg:top-24">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            fulfillment={fulfillment}
          >
            <div className="mb-4 rounded-xl border border-cream-200 bg-white p-4">
              <p className="font-bold text-ink">Payment method</p>
              <p className="mt-1 text-ink-soft">
                Online payment through Razorpay
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Available payment options will appear in the secure checkout.
              </p>
            </div>

            {submitError && (
              <p
                role="alert"
                className="mb-3 rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-800"
              >
                {submitError.message ||
                  "We couldn't complete your payment. Please try again."}
              </p>
            )}

            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting
                ? 'Processing payment…'
                : `Pay ₹${total.toLocaleString('en-IN')} online`}
            </Button>

            <Button to="/cart" variant="ghost" className="mt-2 w-full">
              Back to cart
            </Button>
          </OrderSummary>
        </div>
      </div>
    </Container>
  )
}
