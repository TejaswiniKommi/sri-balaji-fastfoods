export default function EmptyState({ icon = '🍽️', title, message, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border-2 border-dashed border-cream-200 bg-white px-6 py-12 text-center">
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <h2 className="mt-3 text-2xl font-bold text-ink">{title}</h2>
      {message && <p className="mt-1 text-ink-soft">{message}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
