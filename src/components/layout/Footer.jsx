import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Logo from './Logo'
import { CATEGORIES } from '../../data/categories'

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-cream-100">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div>
          <Logo inverted />
          <p className="mt-3 max-w-xs text-cream-200">Fresh • Tasty • Fast</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-lg font-bold text-white">Quick links</h2>
          <ul className="mt-2 space-y-1">
            <li><Link className="inline-block py-1 hover:text-sun-300" to="/menu">Menu</Link></li>
            <li><Link className="inline-block py-1 hover:text-sun-300" to="/cart">Cart</Link></li>
            <li><Link className="inline-block py-1 hover:text-sun-300" to="/about">About &amp; Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-lg font-bold text-white">On the menu</h2>
          <ul className="mt-2 space-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link className="inline-block py-1 hover:text-sun-300" to={`/menu?category=${encodeURIComponent(c.id)}`}>
                  {c.label} <span lang="te" className="font-telugu text-cream-200">{c.labelTe}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm text-cream-200">
          <p>© {new Date().getFullYear()} Sri Balaji Fastfoods</p>
          <Link to="/admin/menu" className="py-2 hover:text-sun-300">Staff: manage menu</Link>
        </Container>
      </div>
    </footer>
  )
}
