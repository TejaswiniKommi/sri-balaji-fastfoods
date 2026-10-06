import { request } from './apiClient'
import { USE_MOCK_ORDERS } from '../data/config'

const ORDERS_PATH = '/api/orders'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function generateOrderNumber() {
  return `SBF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

/**
 * Convert frontend order format
 * to the Spring Boot OrderRequest format.
 */
function toApiOrder(order) {
  return {
    customerName: order.customerName,

    mobileNumber: order.mobile,

    address: order.address || '',

    orderType: order.fulfillment.toUpperCase(),

    totalAmount: order.total,

    items: order.items.map((item) => ({
      foodName: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      subtotal: Number(item.price) * Number(item.quantity),
    })),
  }
}

/**
 * Convert Spring Boot response
 * to the format used by the Order Success page.
 */
function normalizeOrder(saved, draft) {
  return {
    ...draft,

    id: saved?.id,

    orderNumber:
      saved?.id != null
        ? `SBF-${saved.id}`
        : draft.orderNumber,

    createdAt:
      saved?.orderDate ?? draft.createdAt,

    total:
      saved?.totalAmount ?? draft.total,

    status:
      saved?.status ?? 'NEW',

    items:
      saved?.items ?? draft.items,

    isMock: false,
  }
}

/**
 * Place customer order.
 */
export async function placeOrder(order) {
  const draft = {
    ...order,
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
  }

  // Mock order mode
  if (USE_MOCK_ORDERS) {
    await delay(800)

    return {
      ...draft,
      isMock: true,
      status: 'NEW',
    }
  }

  // Real Spring Boot API
  const saved = await request(ORDERS_PATH, {
    method: 'POST',
    body: toApiOrder(order),
  })

  return normalizeOrder(saved, draft)
}

/**
 * Get all customer orders
 * from the Spring Boot backend.
 */
export async function getAllOrders() {
  return request(ORDERS_PATH)
}
  export async function getOrderById(id) {
  return request(`${ORDERS_PATH}/${id}`)
  }
