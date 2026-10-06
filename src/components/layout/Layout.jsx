import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import StickyCartBar from './StickyCartBar'
import useCart from '../../hooks/useCart'

const HIDE_CART_BAR_ON = ['/cart', '/checkout', '/order-success', '/admin']

export default function Layout() {
  const { pathname } = useLocation()
  const { itemCount, subtotal } = useCart()
  const showBar = itemCount > 0 && !HIDE_CART_BAR_ON.some((p) => pathname.startsWith(p))

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-bold text-brand-700 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className={`flex-1 ${showBar ? 'pb-24 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <StickyCartBar visible={showBar} itemCount={itemCount} subtotal={subtotal} />
    </div>
  )
}
