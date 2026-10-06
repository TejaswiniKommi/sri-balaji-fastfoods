const fieldBase =
  'block w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted ' +
  'transition focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:border-brand-600'

/** Labelled input / textarea with accessible error text. */
export default function TextField({ id, label, error, hint, required, multiline = false, className = '', ...props }) {
  const Tag = multiline ? 'textarea' : 'input'
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-bold text-ink">
        {label}
        {required && <span className="text-brand-600" aria-hidden="true"> *</span>}
        {!required && <span className="font-normal text-ink-muted"> (optional)</span>}
      </label>
      <Tag
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`${fieldBase} ${error ? 'border-brand-600' : 'border-cream-200'} ${multiline ? 'min-h-24' : ''}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-semibold text-brand-700">
          {error}
        </p>
      )}
    </div>
  )
}
