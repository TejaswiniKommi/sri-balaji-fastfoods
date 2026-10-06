import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import CheckoutForm from '../components/checkout/CheckoutForm'
import OrderSummary from '../components/checkout/OrderSummary'
import useCart from '../hooks/useCart'
import { placeOrder } from '../services/orderService'
import { STORAGE_KEYS } from '../data/config'

/** Keeps digits only; drops a leading 91 / 0 so +91 98765 43210 and 098765 43210 both work. */
function normalizeMobile(input) {
  let digits = input.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

function validate(values, fulfillment) {
  const errors = {}
  if (values.customerName.trim().length < 2) errors.customerName = 'Please enter your name.'
  if (!/^[6-9]\d{9}$/.test(normalizeMobile(values.mobile))) errors.mobile = 'Enter a valid 10-digit mobile number.'
  if (fulfillment === 'delivery' && values.address.trim().length < 5) errors.address = 'Please enter your delivery address.'
  return errors
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, deliveryFee, total, fulfillment, setFulfillment, clearCart } = useCart()
  const [values, setValues] = useState({ customerName: '', mobile: '', address: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  if (items.length === 0 && !submitting) {
    return (
      <Container className="py-12">
        <EmptyState icon="🛒" title="Your cart is empty" message="Add some items before checking out.">
          <Button to="/menu">Browse menu</Button>
        </EmptyState>
      </Container>
    )
  }

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
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
      try {
        sessionStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order))
      } catch {
        /* the order page still works from navigation state */
      }
      clearCart()
      navigate('/order-success', { replace: true, state: { order } })
    } catch (err) {
      setSubmitError(err)
      setSubmitting(false)
    }
  }

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Checkout</h1>

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
          <OrderSummary items={items} subtotal={subtotal} deliveryFee={deliveryFee} total={total} fulfillment={fulfillment}>
            {submitError && (
              <p role="alert" className="mb-3 rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-800">
                {submitError.message || "We couldn't place your order. Please try again."}
              </p>
            )}
            <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Placing order…' : 'Place Order'}
            </Button>
            <Button to="/cart" variant="ghost" className="mt-2 w-full">Back to cart</Button>
          </OrderSummary>
        </div>
      </div>
    </Container>
  )
}
