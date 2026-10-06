import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import ContactInfo from '../components/layout/ContactInfo'
import { CATEGORIES } from '../data/categories'

export default function About() {
  return (
    <Container className="py-8 sm:py-12">
      <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">About &amp; contact</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section aria-labelledby="about-title" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 id="about-title" className="text-3xl font-extrabold text-ink">Sri Balaji Fastfoods</h2>
          <p className="mt-3 text-lg text-ink-soft">
            We are a local fast-food shop. Our menu is built around fried rice, noodles and manchurian, with every price listed in rupees.
          </p>

          <h3 className="mt-6 text-xl font-bold text-ink">On our menu</h3>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-center gap-3 text-lg">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl ${c.tint}`} aria-hidden="true">{c.emoji}</span>
                <span className="font-bold text-ink">{c.label}</span>
                <span lang="te" className="font-telugu text-ink-soft">{c.labelTe}</span>
              </li>
            ))}
          </ul>

          <Button to="/menu" className="mt-8">View Menu</Button>
        </section>

        <section aria-labelledby="contact-title" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 id="contact-title" className="mb-5 text-3xl font-extrabold text-ink">Contact &amp; location</h2>
          <ContactInfo />
        </section>
      </div>
    </Container>
  )
}
