import { request, ApiError } from './apiClient'
import { USE_MOCK_FOODS, STORAGE_KEYS } from '../data/config'
import { MOCK_FOODS } from '../data/menu.mock'

const FOODS_PATH = '/api/foods'

// ---------------------------------------------------------------------------
// Field mapping between your Spring Boot Food entity and the UI.
// If your entity uses different field names, change ONLY these two functions.
// ---------------------------------------------------------------------------

/** Spring Boot JSON  ->  shape used by the UI */
export function normalizeFood(raw = {}) {
  const priceRaw = raw.price
  const price = priceRaw === null || priceRaw === undefined || priceRaw === '' ? null : Number(priceRaw)
  return {
    id: raw.id,
    name: raw.name ?? '',
    nameTe: raw.nameTe ?? raw.name_te ?? raw.teluguName ?? '',
    category: raw.category ?? 'Other',
    variant: raw.variant ?? '',
    price: Number.isFinite(price) ? price : null,
    description: raw.description ?? '',
    image: raw.imageUrl ?? raw.image_url ?? raw.image ?? '',
    available: raw.available ?? true,
    featured: raw.featured ?? false,
  }
}

/** UI shape  ->  JSON sent to Spring Boot (POST / PUT) */
export function toApiFood(food) {
  return {
    name: food.name,
    nameTe: food.nameTe,
    category: food.category,
    variant: food.variant,
    price: food.price, // null when "Price to be confirmed"
    description: food.description,
    imageUrl: food.image,
    available: food.available,
    featured: food.featured,
  }
}

// ---------------------------------------------------------------------------
// Mock store (used when VITE_USE_MOCK=true). Admin edits are kept in this browser's localStorage.
// ---------------------------------------------------------------------------
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

function loadMockDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.mockFoods)
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore corrupted storage */
  }
  return MOCK_FOODS.map((f) => ({ ...f }))
}

let mockDb = loadMockDb()

function saveMockDb() {
  try {
    localStorage.setItem(STORAGE_KEYS.mockFoods, JSON.stringify(mockDb))
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

/** Restore the sample menu from menu.mock.js (mock mode only) */
export function resetMockFoods() {
  mockDb = MOCK_FOODS.map((f) => ({ ...f }))
  saveMockDb()
}

// ---------------------------------------------------------------------------
// Public API: the only functions UI code should call
// ---------------------------------------------------------------------------

/** GET /api/foods */
export async function getFoods({ signal } = {}) {
  if (USE_MOCK_FOODS) {
    await delay()
    return mockDb.map(normalizeFood)
  }
  const data = await request(FOODS_PATH, { signal })
  const list = Array.isArray(data) ? data : data?.content ?? [] // plain list or Spring Page
  return list.map(normalizeFood)
}

/** GET /api/foods/{id} */
export async function getFoodById(id, { signal } = {}) {
  if (USE_MOCK_FOODS) {
    await delay(250)
    const found = mockDb.find((f) => String(f.id) === String(id))
    if (!found) throw new ApiError("We couldn't find that item on the menu.", { status: 404 })
    return normalizeFood(found)
  }
  return normalizeFood(await request(`${FOODS_PATH}/${encodeURIComponent(id)}`, { signal }))
}

/** POST /api/foods */
export async function createFood(food) {
  if (USE_MOCK_FOODS) {
    await delay()
    const nextId = mockDb.reduce((max, f) => Math.max(max, Number(f.id) || 0), 0) + 1
    const created = { ...food, id: nextId }
    mockDb = [...mockDb, created]
    saveMockDb()
    return normalizeFood(created)
  }
  return normalizeFood(await request(FOODS_PATH, { method: 'POST', body: toApiFood(food) }))
}

/** PUT /api/foods/{id} */
export async function updateFood(id, food) {
  if (USE_MOCK_FOODS) {
    await delay()
    if (!mockDb.some((f) => String(f.id) === String(id))) {
      throw new ApiError("We couldn't find that item on the menu.", { status: 404 })
    }
    mockDb = mockDb.map((f) => (String(f.id) === String(id) ? { ...f, ...food, id: f.id } : f))
    saveMockDb()
    return normalizeFood(mockDb.find((f) => String(f.id) === String(id)))
  }
  return normalizeFood(
    await request(`${FOODS_PATH}/${encodeURIComponent(id)}`, { method: 'PUT', body: toApiFood(food) }),
  )
}

/** DELETE /api/foods/{id} */
export async function deleteFood(id) {
  if (USE_MOCK_FOODS) {
    await delay()
    mockDb = mockDb.filter((f) => String(f.id) !== String(id))
    saveMockDb()
    return null
  }
  return request(`${FOODS_PATH}/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
