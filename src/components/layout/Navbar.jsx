import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'
import Container from '../ui/Container'
import Logo from './Logo'
import useCart from '../../hooks/useCart'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About & Contact' },
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-base font-bold transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-cream-200'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { itemCount } = useCart()

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/cart"
            className="relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2 font-bold text-ink hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-extrabold text-white sm:static sm:h-6 sm:min-w-6">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-cream-200 bg-cream md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `${linkClass({ isActive })} flex min-h-12 items-center text-lg`}>
                {l.label}
              </NavLink>
            ))}
          </Container>
        </nav>
      )}
    </header>
  )
}
