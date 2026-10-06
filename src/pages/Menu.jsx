import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import CategoryFilter from '../components/food/CategoryFilter'
import FoodGrid, { FoodGridSkeleton } from '../components/food/FoodGrid'
import useFoods from '../hooks/useFoods'
import { getVariantLabel } from '../data/categories'
import { getCategorySummaries, groupByCategory, matchesSearch } from '../utils/menu'
import { plural } from '../utils/format'

export default function Menu() {
  const { foods, loading, error, reload } = useFoods()
  const [params, setParams] = useSearchParams()
  const [variant, setVariant] = useState('')

  const category = params.get('category') || ''
  const query = params.get('q') || ''

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  function clearFilters() {
    setParams({}, { replace: true })
    setVariant('')
  }

  const categoryOptions = [
    { id: '', label: 'All', count: foods.length },
    ...getCategorySummaries(foods).map((c) => ({ id: c.id, label: c.label, labelTe: c.labelTe, emoji: c.emoji, count: c.count })),
  ]

  // Rice types (Basmati / Masoor) available inside the current category selection
  const variants = [...new Set(foods.filter((f) => !category || f.category === category).map((f) => f.variant).filter(Boolean))]
  const variantOptions = [
    { id: '', label: 'All rice types' },
    ...variants.map((v) => ({ id: v, label: getVariantLabel(v).en, labelTe: getVariantLabel(v).te })),
  ]

  const visible = foods.filter(
    (f) => (!category || f.category === category) && (!variant || f.variant === variant) && matchesSearch(f, query),
  )
  const groups = groupByCategory(visible).filter((g) => g.items.length > 0)
  const filtersActive = Boolean(category || query || variant)

  return (
    <Container className="py-8 sm:py-10">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Our menu</h1>
      <p className="mt-1 text-ink-soft">Prices in ₹. Telugu names are shown as on our menu board.</p>

      {/* Search + filters */}
      <div className="sticky top-16 z-20 -mx-4 mt-5 space-y-3 bg-cream/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <div className="relative">
          <label htmlFor="menu-search" className="sr-only">Search the menu</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(e) => setParam('q', e.target.value)}
            placeholder="Search fried rice, noodles, chicken…"
            className="block min-h-12 w-full rounded-xl border-2 border-cream-200 bg-white pl-12 pr-12 text-base text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setParam('q', '')}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-cream-200"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {!loading && foods.length > 0 && (
          <>
            <CategoryFilter
              options={categoryOptions}
              active={category}
              onChange={(id) => {
                setParam('category', id)
                setVariant('')
              }}
            />
            {variants.length > 1 && <CategoryFilter label="Filter by rice type" options={variantOptions} active={variant} onChange={setVariant} />}
          </>
        )}
      </div>

      {/* Results */}
      <div className="mt-4">
        {loading && foods.length === 0 && <FoodGridSkeleton />}

        {error && <ErrorMessage error={error} title="We couldn't load the menu" onRetry={reload} />}

        {!loading && !error && foods.length === 0 && (
          <EmptyState icon="🍽️" title="The menu is empty" message="No items have been added yet. Please check back soon." />
        )}

        {!error && foods.length > 0 && visible.length === 0 && (
          <EmptyState icon="🔍" title="No matching items" message="Try a different word or clear the filters.">
            <Button onClick={clearFilters}>Clear filters</Button>
          </EmptyState>
        )}

        {visible.length > 0 && (
          <>
            <p className="mb-4 text-sm font-semibold text-ink-soft" aria-live="polite">
              Showing {visible.length} {plural(visible.length, 'item', 'items')}
              {filtersActive && (
                <button type="button" onClick={clearFilters} className="ml-3 font-bold text-brand-700 underline-offset-4 hover:underline">
                  Clear filters
                </button>
              )}
            </p>
            <div className="space-y-10">
              {groups.map(({ category: cat, items }) => (
                <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
                  {groups.length > 1 && (
                    <h2 id={`cat-${cat.id}`} className="mb-4 flex flex-wrap items-baseline gap-x-3 text-3xl font-extrabold text-ink">
                      <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                      {cat.labelTe && <span lang="te" className="font-telugu text-xl font-bold text-ink-soft">{cat.labelTe}</span>}
                    </h2>
                  )}
                  <FoodGrid foods={items} />
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
