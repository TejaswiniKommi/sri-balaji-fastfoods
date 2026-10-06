import { createContext, useEffect, useMemo, useReducer } from 'react'
import { DELIVERY_FEE, STORAGE_KEYS } from '../data/config'

export const CartContext = createContext(null)

const MAX_QTY = 99
const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, Math.floor(Number(q) || 1)))

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart)
    if (raw) {
      const parsed = JSON.parse(raw)
      const items = (parsed.items ?? []).filter(
        (i) => i && Number.isFinite(i.price) && Number(i.quantity) > 0,
      )
      return { items, fulfillment: parsed.fulfillment === 'pickup' ? 'pickup' : 'delivery' }
    }
  } catch {
    /* ignore corrupted storage */
  }
  return { items: [], fulfillment: 'delivery' }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { food, quantity } = action
      if (!Number.isFinite(food.price)) return state // items without a price cannot be ordered
      const exists = state.items.some((i) => i.id === food.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === food.id ? { ...i, quantity: clampQty(i.quantity + quantity) } : i,
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: food.id,
            name: food.name,
            nameTe: food.nameTe,
            variant: food.variant,
            category: food.category,
            price: food.price,
            image: food.image,
            quantity: clampQty(quantity),
          },
        ],
      }
    }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: clampQty(action.quantity) } : i)),
      }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'SET_FULFILLMENT':
      return { ...state, fulfillment: action.value === 'pickup' ? 'pickup' : 'delivery' }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state))
    } catch {
      /* storage blocked: cart still works for this session */
    }
  }, [state])

  const value = useMemo(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const deliveryFee = state.fulfillment === 'delivery' && state.items.length > 0 ? DELIVERY_FEE : 0
    return {
      items: state.items,
      fulfillment: state.fulfillment,
      itemCount,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      addItem: (food, quantity = 1) => dispatch({ type: 'ADD', food, quantity }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      setFulfillment: (value) => dispatch({ type: 'SET_FULFILLMENT', value }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
