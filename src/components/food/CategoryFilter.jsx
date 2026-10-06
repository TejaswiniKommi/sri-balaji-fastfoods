const chip =
  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-base font-bold transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2'

/**
 * Horizontally scrollable filter chips.
 * options: [{ id, label, labelTe?, emoji?, count? }]  (id '' or 'all' = everything)
 */
export default function CategoryFilter({ options, active, onChange, label = 'Filter by category' }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((opt) => {
        const selected = opt.id === active
        return (
          <button
            key={opt.id || 'all'}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={`${chip} ${selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-cream-200 bg-white text-ink hover:border-brand-300'}`}
          >
            {opt.emoji && <span aria-hidden="true">{opt.emoji}</span>}
            <span>{opt.label}</span>
            {opt.labelTe && (
              <span lang="te" className={`font-telugu text-sm font-semibold ${selected ? 'text-brand-100' : 'text-ink-soft'}`}>
                {opt.labelTe}
              </span>
            )}
            {opt.count !== undefined && (
              <span className={`rounded-full px-2 text-sm ${selected ? 'bg-white/20' : 'bg-cream-100 text-ink-soft'}`}>{opt.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
