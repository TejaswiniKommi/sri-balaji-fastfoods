import TextField from '../ui/TextField'
import FulfillmentToggle from '../cart/FulfillmentToggle'

/**
 * Controlled customer details form. The submit button lives in the order summary and is linked to this
 * form through the `form="checkout-form"` attribute, so Enter-to-submit and validation still work.
 */
export default function CheckoutForm({ values, errors, onChange, onSubmit, fulfillment, onFulfillmentChange }) {
  const set = (field) => (e) => onChange(field, e.target.value)

  return (
    <form id="checkout-form" onSubmit={onSubmit} noValidate className="space-y-5 rounded-3xl bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-2xl font-extrabold text-ink">Your details</h2>

      <FulfillmentToggle value={fulfillment} onChange={onFulfillmentChange} />

      <TextField
        id="customerName"
        label="Customer name"
        required
        autoComplete="name"
        value={values.customerName}
        onChange={set('customerName')}
        error={errors.customerName}
        placeholder="Your full name"
      />

      <TextField
        id="mobile"
        label="Mobile number"
        required
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={values.mobile}
        onChange={set('mobile')}
        error={errors.mobile}
        placeholder="10-digit mobile number"
        hint="We may call this number about your order."
      />

      {fulfillment === 'delivery' && (
        <TextField
          id="address"
          label="Delivery address"
          required
          multiline
          autoComplete="street-address"
          value={values.address}
          onChange={set('address')}
          error={errors.address}
          placeholder="House / street / landmark"
        />
      )}

      <TextField
        id="notes"
        label="Order notes"
        multiline
        value={values.notes}
        onChange={set('notes')}
        placeholder="Anything we should know? (for example: less spicy)"
      />
    </form>
  )
}
