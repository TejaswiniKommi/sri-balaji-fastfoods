import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import ErrorMessage from '../components/ui/ErrorMessage'
import FoodGrid, { FoodGridSkeleton } from '../components/food/FoodGrid'
import ContactInfo from '../components/layout/ContactInfo'
import useFoods from '../hooks/useFoods'
import { BRAND } from '../data/config'
import { getCategorySummaries } from '../utils/menu'
import { formatPrice, hasPrice, plural } from '../utils/format'

/** The memorable bit: a menu-board panel (green heading pill, dotted leaders, price slips) like the real board. */
function MenuBoard({ foods, loading }) {
  const categories = getCategorySummaries(foods)
  const boardCategory = categories.find((c) => c.id === 'Noodles') ?? categories[0]
  const rows = boardCategory
    ? foods.filter((f) => f.category === boardCategory.id && !f.variant && hasPrice(f)).slice(0, 6)
    : []

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-5 shadow-lift sm:p-7 md:rotate-1">
      {loading ? (
        <div className="space-y-4" role="status" aria-label="Loading menu board">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-lg bg-cream-200" />
          ))}
        </div>
      ) : (
        boardCategory && (
          <>
            <p className="mx-auto -mt-9 mb-4 w-fit rounded-2xl border-2 border-leaf-600 bg-white px-5 py-1.5 text-center shadow">
              <span className="font-display text-xl font-extrabold text-leaf-700">{boardCategory.label}</span>{' '}
              <span lang="te" className="font-telugu text-lg font-bold text-leaf-700">{boardCategory.labelTe}</span>
            </p>
            <ul className="space-y-3">
              {rows.map((f) => (
                <li key={f.id} className="flex items-end gap-2">
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight text-ink">{f.name}</span>
                    <span lang="te" className="block font-telugu text-sm leading-tight text-ink-soft">{f.nameTe}</span>
                  </span>
                  <span className="mb-1.5 min-w-4 flex-1 border-b-2 border-dotted border-ink/30" aria-hidden="true" />
                  <span className="rounded-md bg-sun-100 px-2.5 py-0.5 font-display text-xl font-extrabold text-ink">{formatPrice(f.price)}</span>
                </li>
              ))}
            </ul>
            <Link to={`/menu?category=${encodeURIComponent(boardCategory.id)}`} className="mt-5 inline-block font-bold text-brand-700 underline-offset-4 hover:underline">
              See all {boardCategory.label.toLowerCase()}
            </Link>
          </>
        )
      )}
    </div>
  )
}

const steps = [
  { title: 'Choose your food', text: 'Pick from fried rice, noodles and manchurian on the menu.' },
  { title: 'Add to cart', text: 'Set the quantity and check your total in the cart.' },
  { title: 'Place your order', text: 'Enter your details and choose delivery or pickup.' },
]

export default function Home() {
  const { foods, loading, error, reload } = useFoods()
  const categories = getCategorySummaries(foods)
  const featured = foods.filter((f) => f.featured && f.available !== false)
  const featuredList = (featured.length ? featured : foods.filter((f) => hasPrice(f))).slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-600 text-white">
        <Container className="grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block rounded-full bg-sun-400 px-4 py-1.5 font-extrabold text-ink">{BRAND.tagline}</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">Sri Balaji Fastfoods</h1>
            <p className="mt-5 max-w-md text-lg text-brand-50">
              Fried rice, noodles and manchurian, ready to order online for pickup or delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/menu" variant="light" size="lg">View Menu</Button>
              <Button href="#featured" variant="accent" size="lg">Order Now</Button>
            </div>
          </div>
          <div className="pt-6 md:pt-0">
            <MenuBoard foods={foods} loading={loading} />
          </div>
        </Container>
      </section>

      {error && (
        <Container className="pt-10">
          <ErrorMessage error={error} title="We couldn't load the menu" onRetry={reload} />
        </Container>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Container as="section" className="pt-14">
          <SectionHeading title="What we make" subtitle="Tap a category to see every item and price." />
          <ul className="grid gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/menu?category=${encodeURIComponent(c.id)}`}
                  className="flex h-full items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl ${c.tint}`} aria-hidden="true">{c.emoji}</span>
                  <span>
                    <span className="block font-display text-2xl font-extrabold leading-tight text-ink">{c.label}</span>
                    {c.labelTe && <span lang="te" className="block font-telugu text-ink-soft">{c.labelTe}</span>}
                    <span className="block text-sm text-ink-muted">
                      {c.count} {plural(c.count, 'item', 'items')}
                      {c.minPrice !== null && `, from ${formatPrice(c.minPrice)}`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      {/* Featured / quick order */}
      <Container as="section" className="scroll-mt-20 pt-14" id="featured">
        <SectionHeading
          title="Featured items"
          subtitle="Add your favourites straight from here."
          action={<Button to="/menu" variant="outline" size="sm">Full menu</Button>}
        />
        {loading ? <FoodGridSkeleton count={4} /> : featuredList.length > 0 ? <FoodGrid foods={featuredList} /> : null}
      </Container>

      {/* How ordering works (a real sequence, so numbering is meaningful) */}
      <Container as="section" className="pt-14">
        <SectionHeading title="How ordering works" />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-2xl bg-sun-100 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-extrabold text-white">{i + 1}</span>
              <div>
                <h3 className="text-xl font-bold text-ink">{s.title}</h3>
                <p className="text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      {/* Contact */}
      <Container as="section" className="pt-14">
        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-card md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Find us</h2>
            <p className="mt-2 text-ink-soft">Call, message or visit Sri Balaji Fastfoods.</p>
            <Button to="/about" variant="outline" className="mt-6">Contact details</Button>
          </div>
          <ContactInfo />
        </div>
      </Container>
    </>
  )
}
