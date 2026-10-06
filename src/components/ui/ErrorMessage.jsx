import { TriangleAlert } from 'lucide-react'
import Button from './Button'

/** Friendly, actionable error box. Pass the caught error and an optional retry callback. */
export default function ErrorMessage({ error, title = "Something didn't load", onRetry, className = '' }) {
  const message = error?.message || 'Please try again.'
  return (
    <div role="alert" className={`mx-auto flex max-w-xl flex-col items-center rounded-3xl bg-white p-8 text-center shadow-card ${className}`}>
      <TriangleAlert className="h-10 w-10 text-brand-600" aria-hidden="true" />
      <h2 className="mt-3 text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-1 text-ink-soft">{message}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
