'use client'

import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Volume2, VolumeX } from 'lucide-react'

interface Order {
  id: string
  orderNumber: number
  status: 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
}

export default function CDSPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const previousReadyOrders = useRef<Set<number>>(new Set())

  useEffect(() => {
    fetchOrders()

    // Auto-refresh every 3 seconds
    const orderInterval = setInterval(fetchOrders, 3000)

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(orderInterval)
      clearInterval(timeInterval)
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=30')
      const data = await res.json()
      // Filter only active orders
      const activeOrders = data.filter((order: Order) =>
        ['PREPARING', 'READY'].includes(order.status)
      )

      // Check for new ready orders to play sound
      const newReadyOrders = activeOrders.filter(
        (o: Order) => o.status === 'READY' && !previousReadyOrders.current.has(o.orderNumber)
      )

      if (newReadyOrders.length > 0 && soundEnabled && !loading) {
        playNotificationSound()
        // Announce the order numbers
        newReadyOrders.forEach((order: Order) => {
          announceOrder(order.orderNumber)
        })
      }

      // Update previous ready orders
      previousReadyOrders.current = new Set(
        activeOrders.filter((o: Order) => o.status === 'READY').map((o: Order) => o.orderNumber)
      )

      setOrders(activeOrders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Play a pleasant ding sound
      const playNote = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      const now = audioContext.currentTime
      playNote(880, now, 0.15)
      playNote(1100, now + 0.15, 0.15)
      playNote(1320, now + 0.3, 0.3)
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  const announceOrder = (orderNumber: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Заказ номер ${orderNumber} готов`)
      utterance.lang = 'ru-RU'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const preparingOrders = orders.filter(o => o.status === 'PREPARING')
  const readyOrders = orders.filter(o => o.status === 'READY')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-400 text-xl">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur border-b border-gray-700 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🍔</div>
            <div>
              <h1 className="text-2xl font-bold text-white">FastFood</h1>
              <p className="text-gray-400">Статус заказов</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-xl transition-colors ${
                soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold text-white font-mono">
                {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-400">
                {currentTime.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Preparing Column */}
        <div className="flex-1 border-r border-gray-700 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-yellow-500">ГОТОВИТСЯ</h2>
            </div>
            <p className="text-gray-500">Пожалуйста, подождите</p>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">Нет заказов в приготовлении</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 text-center animate-fade-in"
                >
                  <span className="text-5xl md:text-6xl font-bold text-yellow-500">
                    {order.orderNumber}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready Column */}
        <div className="flex-1 p-8 bg-green-500/5">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-green-500">ГОТОВО</h2>
            </div>
            <p className="text-gray-500">Заберите ваш заказ</p>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">Нет готовых заказов</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6 text-center animate-pulse-green"
                >
                  <span className="text-5xl md:text-6xl font-bold text-green-500">
                    {order.orderNumber}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer with ads/promotions */}
      <footer className="bg-gradient-to-r from-red-600 to-orange-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎉</span>
            <div>
              <h3 className="text-xl font-bold text-white">Комбо дня!</h3>
              <p className="text-red-100">Бургер + Фри + Кола = 42,000 сум</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-3xl">📱</span>
              <p className="text-red-100 text-sm">Click</p>
            </div>
            <div className="text-center">
              <span className="text-3xl">📱</span>
              <p className="text-red-100 text-sm">Payme</p>
            </div>
            <div className="text-center">
              <span className="text-3xl">💳</span>
              <p className="text-red-100 text-sm">Uzcard</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
