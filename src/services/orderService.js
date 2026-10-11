
import { request } from './apiClient'
import { USE_MOCK_ORDERS } from '../data/config'

const ORDERS_PATH = '/api/orders'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function generateOrderNumber() {
  return `SBF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

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

function normalizeOrder(saved, draft) {
  return {
    ...draft,
    id: saved?.id,
    orderNumber: saved?.id != null ? `SBF-${saved.id}` : draft.orderNumber,
    createdAt: saved?.orderDate ?? draft.createdAt,
    total: saved?.totalAmount ?? draft.total,
    status: saved?.status ?? 'NEW',
    paymentStatus: saved?.paymentStatus ?? 'PENDING',
    items: saved?.items ?? draft.items,
    isMock: false,
  }
}

// Customer checkout: public endpoint
export async function placeOrder(order) {
  const draft = {
    ...order,
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
  }

  if (USE_MOCK_ORDERS) {
    await delay(800)
    return {
      ...draft,
      isMock: true,
      status: 'NEW',
      paymentStatus: 'PENDING',
    }
  }

  const saved = await request(ORDERS_PATH, {
    method: 'POST',
    body: toApiOrder(order),
  })

  return normalizeOrder(saved, draft)
}

// Admin only: load all customer orders
export async function getAllOrders() {
  return request(ORDERS_PATH, { admin: true })
}

// Admin only: retrieve full details for one order
export async function getOrderById(id) {
  return request(`${ORDERS_PATH}/${encodeURIComponent(id)}`, {
    admin: true,
  })
}

// Customer tracking: verify mobile number and return tracking status only
export async function trackOrder(id, mobileNumber) {
  return request(
    `${ORDERS_PATH}/${encodeURIComponent(id)}/track`,
    {
      method: 'POST',
      body: { mobileNumber },
    },
  )
}
