
import { request, ApiError } from './apiClient'
import { USE_MOCK_FOODS, STORAGE_KEYS } from '../data/config'
import { MOCK_FOODS } from '../data/menu.mock'

const FOODS_PATH = '/api/foods'

// Spring Boot JSON -> UI format
export function normalizeFood(raw = {}) {
  const priceRaw = raw.price
  const price =
    priceRaw === null || priceRaw === undefined || priceRaw === ''
      ? null
      : Number(priceRaw)

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

// UI format -> Spring Boot JSON
export function toApiFood(food) {
  return {
    name: food.name,
    nameTe: food.nameTe,
    category: food.category,
    variant: food.variant,
    price: food.price,
    description: food.description,
    imageUrl: food.image,
    available: food.available,
    featured: food.featured,
  }
}

// Mock store for local sample-data mode
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

function loadMockDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.mockFoods)
    if (saved) return JSON.parse(saved)
  } catch {
    // Ignore corrupted storage
  }

  return MOCK_FOODS.map((food) => ({ ...food }))
}

let mockDb = loadMockDb()

function saveMockDb() {
  try {
    localStorage.setItem(STORAGE_KEYS.mockFoods, JSON.stringify(mockDb))
  } catch {
    // Keep working in memory if storage is unavailable
  }
}

// Restore sample menu in mock mode
export function resetMockFoods() {
  mockDb = MOCK_FOODS.map((food) => ({ ...food }))
  saveMockDb()
}

// GET /api/foods — public menu
export async function getFoods({ signal } = {}) {
  if (USE_MOCK_FOODS) {
    await delay()
    return mockDb.map(normalizeFood)
  }

  const data = await request(FOODS_PATH, { signal })
  const list = Array.isArray(data) ? data : data?.content ?? []

  return list.map(normalizeFood)
}

// GET /api/foods/{id} — public food details
export async function getFoodById(id, { signal } = {}) {
  if (USE_MOCK_FOODS) {
    await delay(250)

    const found = mockDb.find((food) => String(food.id) === String(id))

    if (!found) {
      throw new ApiError("We couldn't find that item on the menu.", {
        status: 404,
      })
    }

    return normalizeFood(found)
  }

  return normalizeFood(
    await request(`${FOODS_PATH}/${encodeURIComponent(id)}`, { signal }),
  )
}

// POST /api/foods — ADMIN ONLY
export async function createFood(food) {
  if (USE_MOCK_FOODS) {
    await delay()

    const nextId =
      mockDb.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1

    const created = { ...food, id: nextId }
    mockDb = [...mockDb, created]
    saveMockDb()

    return normalizeFood(created)
  }

  return normalizeFood(
    await request(FOODS_PATH, {
      method: 'POST',
      body: toApiFood(food),
      admin: true,
    }),
  )
}

// PUT /api/foods/{id} — ADMIN ONLY
export async function updateFood(id, food) {
  if (USE_MOCK_FOODS) {
    await delay()

    if (!mockDb.some((item) => String(item.id) === String(id))) {
      throw new ApiError("We couldn't find that item on the menu.", {
        status: 404,
      })
    }

    mockDb = mockDb.map((item) =>
      String(item.id) === String(id)
        ? { ...item, ...food, id: item.id }
        : item,
    )

    saveMockDb()

    return normalizeFood(
      mockDb.find((item) => String(item.id) === String(id)),
    )
  }

  return normalizeFood(
    await request(`${FOODS_PATH}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: toApiFood(food),
      admin: true,
    }),
  )
}

// DELETE /api/foods/{id} — ADMIN ONLY
export async function deleteFood(id) {
  if (USE_MOCK_FOODS) {
    await delay()
    mockDb = mockDb.filter((item) => String(item.id) !== String(id))
    saveMockDb()
    return null
  }

  return request(`${FOODS_PATH}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    admin: true,
  })
}
