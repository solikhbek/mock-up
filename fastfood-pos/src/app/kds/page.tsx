'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  ChefHat,
  CheckCircle,
  PlayCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react'

interface OrderItem {
  id: string
  quantity: number
  note?: string
  product: {
    name: string
    nameUz?: string
  }
}

interface Order {
  id: string
  orderNumber: number
  status: 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
  type: 'DINE_IN' | 'TAKEAWAY'
  createdAt: string
  items: OrderItem[]
}

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchOrders()

    // Auto-refresh every 5 seconds if enabled
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchOrders, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=20')
      const data = await res.json()
      // Filter only active orders
      const activeOrders = data.filter((order: Order) =>
        ['NEW', 'PREPARING', 'READY'].includes(order.status)
      )
      setOrders(activeOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      // Play sound if enabled
      if (soundEnabled && newStatus === 'READY') {
        playNotificationSound()
      }

      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const playNotificationSound = () => {
    // Using Web Audio API to create a simple notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  const getTimeSinceOrder = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime()
    const minutes = Math.floor(diff / 60000)
    return minutes
  }

  const getTimeColor = (minutes: number) => {
    if (minutes < 5) return 'text-green-600 bg-green-100'
    if (minutes < 10) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Новый</span>
      case 'PREPARING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Готовится</span>
      case 'READY':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Готов</span>
      default:
        return null
    }
  }

  const newOrders = orders.filter(o => o.status === 'NEW')
  const preparingOrders = orders.filter(o => o.status === 'PREPARING')
  const readyOrders = orders.filter(o => o.status === 'READY')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">KDS - Экран Кухни</h1>
                <p className="text-sm text-gray-400">FastFood Central</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4 mr-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{newOrders.length}</div>
                <div className="text-xs text-gray-500">Новых</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{preparingOrders.length}</div>
                <div className="text-xs text-gray-500">Готовятся</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{readyOrders.length}</div>
                <div className="text-xs text-gray-500">Готовы</div>
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
              }`}
              title={soundEnabled ? 'Звук включён' : 'Звук выключен'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
              }`}
              title={autoRefresh ? 'Авто-обновление включено' : 'Авто-обновление выключено'}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </button>
            <button
              onClick={fetchOrders}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
              title="Обновить"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-400"
              title="Полный экран"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <main className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ChefHat className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">Нет активных заказов</h2>
            <p className="text-gray-600 mt-2">Новые заказы появятся здесь автоматически</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => {
              const minutes = getTimeSinceOrder(order.createdAt)
              const timeColor = getTimeColor(minutes)

              return (
                <div
                  key={order.id}
                  className={`bg-gray-800 rounded-xl border-2 overflow-hidden transition-all ${
                    order.status === 'NEW'
                      ? 'border-blue-500 animate-pulse'
                      : order.status === 'PREPARING'
                      ? 'border-yellow-500'
                      : 'border-green-500'
                  }`}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold text-white">#{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded ${timeColor}`}>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {minutes} мин
                      </span>
                      <span className="text-gray-400">
                        {order.type === 'TAKEAWAY' ? '📦 С собой' : '🍽️ В зале'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {item.quantity}
                        </span>
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.product.name}</p>
                          {item.note && (
                            <p className="text-yellow-400 text-sm mt-0.5">⚠️ {item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="p-4 border-t border-gray-700">
                    {order.status === 'NEW' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className="w-full py-3 bg-yellow-500 text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
                      >
                        <PlayCircle className="w-5 h-5" />
                        Начать готовить
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        className="w-full py-3 bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Готово
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className="w-full py-3 bg-gray-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-500 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Выдан
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
