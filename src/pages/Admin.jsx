import { API_BASE_URL } from '../data/config'
import { useEffect, useRef, useState } from 'react'
import { Plus, TriangleAlert } from 'lucide-react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import FoodTable from '../components/admin/FoodTable'
import FoodForm from '../components/admin/FoodForm'
import useFoods from '../hooks/useFoods'
import {
  createFood,
  updateFood,
  deleteFood,
  resetMockFoods,
} from '../services/foodService'
import { getAllOrders } from '../services/orderService'
import { USE_MOCK_FOODS } from '../data/config'
import { getCategoryIds } from '../utils/menu'

/**
 * Menu management UI.
 * It talks to foodService for create / update / delete.
 * Customer orders are loaded from the Spring Boot backend.
 *
 * NOTE: there is no login yet.
 * Protect this route before the site goes live.
 */
export default function Admin() {
  const { foods, loading, error, reload } = useFoods()

  const [orders, setOrders] = useState([])
const [ordersLoading, setOrdersLoading] = useState(false)
const [ordersError, setOrdersError] = useState('')
const [newOrderAlert, setNewOrderAlert] = useState(false)
const [alertsEnabled, setAlertsEnabled] = useState(false)
const alertsEnabledRef = useRef(false)
const latestOrderId = useRef(0)
const audioContextRef = useRef(null)
  useEffect(() => {
  async function loadInitialOrders() {
    setOrdersLoading(true)
    setOrdersError('')

    try {
      const data = await getAllOrders()

      setOrders(data)

      if (data.length > 0) {
        const maxId = Math.max(...data.map((order) => order.id || 0))
        latestOrderId.current = maxId
      }
    } catch (err) {
      setOrdersError(err.message || 'Could not load orders.')
    } finally {
      setOrdersLoading(false)
    }
  }

  async function checkForNewOrders() {
    try {
      const data = await getAllOrders()

      if (data.length > 0) {
        const maxId = Math.max(...data.map((order) => order.id || 0))

        if (maxId > latestOrderId.current) {
          latestOrderId.current = maxId
          setNewOrderAlert(true)

          if (alertsEnabledRef.current) {
  playOrderAlarm()
}
        }
      }

      setOrders(data)
    } catch (err) {
      console.error('Could not check orders:', err)
    }
  }

  loadInitialOrders()

  const interval = setInterval(checkForNewOrders, 5000)

  return () => clearInterval(interval)
}, [])

  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')

  function playOrderAlarm() {
  try {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext

    if (!AudioContext) {
      return
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const audioContext = audioContextRef.current

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(900, audioContext.currentTime)

    const now = audioContext.currentTime

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.05)

    oscillator.start(now)

    // 5-second alarm
    gain.gain.setValueAtTime(0.9, now + 4.5)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 5)

    oscillator.stop(now + 5)
  } catch (error) {
    console.error('Could not play order alarm:', error)
  }
}
async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/${orderId}/status?status=${status}`,
      {
        method: 'PUT',
      }
    )

    if (!response.ok) {
      throw new Error('Could not update order status.')
    }

    const updatedOrder = await response.json()

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId ? updatedOrder : order
      )
    )
  } catch (error) {
    console.error('Could not update order status:', error)
    setOrdersError(error.message || 'Could not update order status.')
  }
}

  const closeForm = () => {
    setEditing(null)
    setActionError('')
  }

  async function handleSave(data) {
    setBusy(true)
    setActionError('')

    try {
      if (editing === 'new') {
        await createFood(data)
        setNotice(`Added “${data.name}”.`)
      } else {
        await updateFood(editing.id, data)
        setNotice(`Saved changes to “${data.name}”.`)
      }

      setEditing(null)
      reload()
    } catch (err) {
      setActionError(err.message || 'Could not save. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    setActionError('')

    try {
      await deleteFood(deleting.id)
      setNotice(`Deleted “${deleting.name}”.`)
      setDeleting(null)
      reload()
    } catch (err) {
      setActionError(err.message || 'Could not delete. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
            Manage menu
          </h1>

          <p className="mt-1 text-ink-soft">
            Add, edit or remove food items.
          </p>
        </div>


        <Button
          onClick={() => {
            setNotice('')
            setEditing('new')
          }}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add food
        </Button>
      </div>

      <div className="mt-5 space-y-2">
        <p className="flex items-start gap-2 rounded-xl bg-saffron-100 px-4 py-3 font-semibold text-saffron-700">
          <TriangleAlert
            className="mt-0.5 h-5 w-5 shrink-0"
            aria-hidden="true"
          />

          There is no login on this page yet. Add authentication before the
          site goes live.
        </p>

        {USE_MOCK_FOODS && (
          <p className="rounded-xl bg-sun-100 px-4 py-3 text-ink-soft">
            Sample-data mode: changes are saved only in this browser. Set{' '}
            <code className="font-bold">VITE_USE_MOCK=false</code> to manage
            the menu in your Spring Boot backend.{' '}
            <button
              type="button"
              className="font-bold text-brand-700 underline-offset-4 hover:underline"
              onClick={() => {
                resetMockFoods()
                setNotice('Sample menu restored.')
                reload()
              }}
            >
              Restore sample menu
            </button>
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-xl bg-leaf-100 px-4 py-3 font-bold text-leaf-700"
          >
            {notice}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
  <div>
    <p className="font-extrabold text-ink">
      Order Alerts
    </p>

    <p className="text-sm text-ink-soft">
      {alertsEnabled
        ? 'Sound alerts are enabled.'
        : 'Enable sound to hear an alarm when a new order arrives.'}
    </p>
  </div>

  <Button
    onClick={() => {
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext

        if (AudioContext) {
          audioContextRef.current = new AudioContext()
          audioContextRef.current.resume()
        }
      }

      alertsEnabledRef.current = true
setAlertsEnabled(true)
playOrderAlarm()
    }}
    disabled={alertsEnabled}
  >
    {alertsEnabled ? '🔔 Alerts Enabled' : '🔔 Enable Order Alerts'}
  </Button>
</div>

      {/* Customer Orders */}

      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-ink">
          Customer Orders
        </h2>

        <p className="mt-1 text-ink-soft">
          Orders placed by customers will appear here.
        </p>

        {ordersLoading && (
          <div className="mt-4">
            <Spinner label="Loading orders…" />
          </div>
        )}

        {ordersError && (
          <div className="mt-4">
            <ErrorMessage
              error={ordersError}
              title="We couldn't load orders"
            />
          </div>
        )}

        {!ordersLoading && !ordersError && orders.length === 0 && (
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-card">
            <p className="text-ink-soft">
              No customer orders yet.
            </p>
          </div>
        )}

        {!ordersLoading && !ordersError && orders.length > 0 && (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-5 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-ink">
                      Order #{order.id}
                    </h3>

                    <p className="mt-1 text-ink-soft">
                      {order.customerName}
                    </p>

                    <p className="text-ink-soft">
                      {order.mobileNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-brand-700">
                      ₹{order.totalAmount}
                    </p>

                    <p className="text-sm font-semibold text-ink-soft">
                      {order.status}  
                    </p>
                    <p className="mt-1 text-sm font-semibold">
  Payment:{' '}
  <span
    className={
      order.paymentStatus === 'PAID'
        ? 'text-green-700'
        : 'text-orange-700'
    }
  >
    {order.paymentStatus || 'PENDING'}
  </span>
</p>
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
  {order.status === 'NEW' && (
    <Button
      onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
    >
      Accept Order
    </Button>
  )}

  {order.status === 'ACCEPTED' && (
    <Button
      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
    >
      Start Preparing
    </Button>
  )}

  {order.status === 'PREPARING' && (
    <Button
      onClick={() => updateOrderStatus(order.id, 'READY')}
    >
      Mark Ready
    </Button>
  )}

  {order.status === 'READY' && (
    <Button
      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
    >
      Mark Delivered
    </Button>
  )}
</div>
                  </div>
                </div>

                <div className="mt-4 border-t border-cream-200 pt-4">
                  <p className="font-bold text-ink">
                    {order.orderType}
                  </p>

                  
{order.address && (
  <div className="mt-1">
    <p className="text-ink-soft">
      Address: {order.address}
    </p>

    
<a
  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    
'CANARA BANK ATM, D.NO, 3/667, Setti Gunta Rd, Lakshmipuram, Nellore, Andhra Pradesh 524002, India'

  )}&destination=${encodeURIComponent(
    order.address + ', Nellore, Andhra Pradesh, India'
  )}&travelmode=driving`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-2 inline-flex items-center gap-2 font-bold text-brand-700 underline hover:text-brand-800"
>
  📍 Get directions in Google Maps
</a>

  </div>
)}


                  <div className="mt-3 space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-3"
                      >
                        <span className="text-ink">
                          {item.foodName} × {item.quantity}
                        </span>

                        <span className="font-bold text-ink">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Menu */}

      <div className="mt-6">
        {loading && foods.length === 0 && (
          <Spinner label="Loading menu…" />
        )}

        {error && (
          <ErrorMessage
            error={error}
            title="We couldn't load the menu"
            onRetry={reload}
          />
        )}

        {!loading && !error && foods.length === 0 && (
          <EmptyState
            icon="🍽️"
            title="No food items yet"
            message="Add your first item to start building the menu."
          >
            <Button onClick={() => setEditing('new')}>
              Add food
            </Button>
          </EmptyState>
        )}

        {foods.length > 0 && (
          <FoodTable
            foods={foods}
            onEdit={(f) => {
              setNotice('')
              setEditing(f)
            }}
            onDelete={(f) => {
              setActionError('')
              setDeleting(f)
            }}
          />
        )}
      </div>

      {editing && (
        <Modal
          title={editing === 'new' ? 'Add food' : 'Edit food'}
          onClose={closeForm}
        >
          <FoodForm
            initial={editing === 'new' ? null : editing}
            categoryIds={getCategoryIds(foods)}
            onSubmit={handleSave}
            onCancel={closeForm}
            saving={busy}
            error={actionError}
          />
        </Modal>
      )}

      {deleting && (
        <Modal
          title="Delete this item?"
          onClose={() => setDeleting(null)}
          maxWidth="max-w-md"
        >
          <p className="text-ink-soft">
            “{deleting.name}
            {deleting.variant ? ` (${deleting.variant})` : ''}” will be
            removed from the menu. This can't be undone.
          </p>

          {actionError && (
            <p
              role="alert"
              className="mt-3 rounded-xl bg-brand-50 px-4 py-3 font-semibold text-brand-800"
            >
              {actionError}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleting(null)}
              disabled={busy}
            >
              Keep item
            </Button>

            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={busy}
            >
              {busy ? 'Deleting…' : 'Delete item'}
            </Button>
          </div>
        </Modal>
      )}
    </Container>
  )
}