// ---------------------------------------------------------------------------
// Central place for settings you are likely to change.
// ---------------------------------------------------------------------------
const env = import.meta.env

/** Spring Boot backend URL (set VITE_API_BASE_URL in .env) */
export const API_BASE_URL = (env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '')

/** true = sample menu from data/menu.mock.js, false = real Spring Boot /api/foods */
export const USE_MOCK_FOODS = env.VITE_USE_MOCK !== 'false'

/** true = fake order submission, false = POST /api/orders (once you build it) */
export const USE_MOCK_ORDERS = env.VITE_USE_MOCK_ORDERS !== 'false'

/** Delivery fee in rupees. Applied only to "Delivery" orders. */
export const DELIVERY_FEE = Number(env.VITE_DELIVERY_FEE ?? 0) || 0

export const BRAND = {
  name: 'Sri Balaji Fastfoods',
  shortName: 'SB',
  tagline: 'Fresh • Tasty • Fast',
}

/**
 * Contact details. Leave a field empty ('') until you have the real value;
 * the site shows "Coming soon" for empty fields instead of inventing anything.
 */
export const CONTACT = {
  phone: '',      // e.g. '98xxxxxx00'
  whatsapp: '',   // e.g. '9198xxxxxx00' (country code, no + or spaces)
  address: '',    // shop address
  hours: '',      // e.g. '10:00 AM - 10:00 PM'
  mapUrl: '',     // Google Maps link to the shop
}

export const STORAGE_KEYS = {
  cart: 'sbf.cart.v1',
  mockFoods: 'sbf.mockFoods.v2',
  lastOrder: 'sbf.lastOrder.v1',
}
