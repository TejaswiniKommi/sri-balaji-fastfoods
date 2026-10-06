export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={`flex flex-col items-center justify-center gap-3 py-16 text-ink-soft ${className}`}>
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" aria-hidden="true" />
      <span className="font-semibold">{label}</span>
    </div>
  )
}
