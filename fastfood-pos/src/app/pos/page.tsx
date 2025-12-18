'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  UtensilsCrossed,
  Search,
  X,
  Check
} from 'lucide-react'

interface Category {
  id: string
  name: string
  nameUz?: string
  icon?: string
}

interface Product {
  id: string
  name: string
  nameUz?: string
  description?: string
  price: number
  categoryId: string
  inStock: boolean
}

interface CartItem {
  product: Product
  quantity: number
  note?: string
}

type PaymentMethod = 'CASH' | 'UZCARD' | 'HUMO' | 'CLICK' | 'PAYME' | 'UZUM'
type OrderType = 'DINE_IN' | 'TAKEAWAY'

const paymentMethods: { id: PaymentMethod; name: string; icon: any }[] = [
  { id: 'CASH', name: 'Наличные', icon: Banknote },
  { id: 'UZCARD', name: 'Uzcard', icon: CreditCard },
  { id: 'HUMO', name: 'Humo', icon: CreditCard },
  { id: 'CLICK', name: 'Click', icon: Smartphone },
  { id: 'PAYME', name: 'Payme', icon: Smartphone },
  { id: 'UZUM', name: 'Uzum Bank', icon: Smartphone },
]

export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
      if (data.length > 0) {
        setSelectedCategory(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameUz?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && product.inStock
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setShowPayment(false)
    setSelectedPayment(null)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = 0
  const total = subtotal - discount

  const processPayment = async () => {
    if (!selectedPayment || cart.length === 0) return

    setIsProcessing(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: 'demo-branch', // In real app, get from context
          userId: 'demo-user',
          type: orderType,
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            note: item.note,
          })),
          paymentMethod: selectedPayment,
          paymentStatus: 'PAID',
          discount,
        }),
      })

      const order = await res.json()
      setOrderComplete(order.orderNumber)
      setCart([])
      setShowPayment(false)
      setSelectedPayment(null)

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setOrderComplete(null)
      }, 3000)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Ошибка при создании заказа')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  // Функция для определения иконки по названию продукта
  const getProductIcon = (name: string): string => {
    const lowerName = name.toLowerCase()

    if (lowerName.includes('бургер') || lowerName.includes('burger') || lowerName.includes('биг мак') || lowerName.includes('воппер') || lowerName.includes('гамбургер')) return '🍔'
    if (lowerName.includes('хот-дог') || lowerName.includes('хотдог') || lowerName.includes('hot dog')) return '🌭'
    if (lowerName.includes('сэндвич') || lowerName.includes('сендвич') || lowerName.includes('sandwich') || lowerName.includes('ролл') || lowerName.includes('шаурма') || lowerName.includes('донер')) return '🥪'
    if (lowerName.includes('пицца') || lowerName.includes('pizza')) return '🍕'
    if (lowerName.includes('фри') || lowerName.includes('картофель') || lowerName.includes('картошка') || lowerName.includes('fries')) return '🍟'
    if (lowerName.includes('наггетс') || lowerName.includes('нагетс') || lowerName.includes('nugget') || lowerName.includes('стрипс') || lowerName.includes('крылышки') || lowerName.includes('wings')) return '🍗'
    if (lowerName.includes('куриц') || lowerName.includes('курин') || lowerName.includes('chicken')) return '🍗'
    if (lowerName.includes('салат') || lowerName.includes('salad')) return '🥗'
    if (lowerName.includes('кола') || lowerName.includes('cola') || lowerName.includes('пепси') || lowerName.includes('спрайт') || lowerName.includes('фанта') || lowerName.includes('газировка')) return '🥤'
    if (lowerName.includes('сок') || lowerName.includes('juice') || lowerName.includes('нектар')) return '🧃'
    if (lowerName.includes('кофе') || lowerName.includes('coffee') || lowerName.includes('латте') || lowerName.includes('капучино') || lowerName.includes('американо')) return '☕'
    if (lowerName.includes('чай') || lowerName.includes('tea')) return '🍵'
    if (lowerName.includes('коктейль') || lowerName.includes('милкшейк') || lowerName.includes('shake') || lowerName.includes('смузи')) return '🥛'
    if (lowerName.includes('мороженое') || lowerName.includes('морожен') || lowerName.includes('ice cream') || lowerName.includes('пломбир') || lowerName.includes('санде') || lowerName.includes('макфлурри')) return '🍦'
    if (lowerName.includes('пирог') || lowerName.includes('pie') || lowerName.includes('торт') || lowerName.includes('cake') || lowerName.includes('маффин') || lowerName.includes('кекс')) return '🍰'
    if (lowerName.includes('пончик') || lowerName.includes('donut') || lowerName.includes('донат')) return '🍩'
    if (lowerName.includes('печень') || lowerName.includes('cookie')) return '🍪'
    if (lowerName.includes('тако') || lowerName.includes('taco')) return '🌮'
    if (lowerName.includes('буррито') || lowerName.includes('burrito')) return '🌯'
    if (lowerName.includes('соус') || lowerName.includes('sauce') || lowerName.includes('кетчуп') || lowerName.includes('майонез')) return '🫙'
    if (lowerName.includes('вода') || lowerName.includes('water') || lowerName.includes('минерал')) return '💧'

    return '🍽️'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">POS Касса</h1>
                <p className="text-sm text-gray-500">FastFood Central</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Order Type Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setOrderType('DINE_IN')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    orderType === 'DINE_IN' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  В зале
                </button>
                <button
                  onClick={() => setOrderType('TAKEAWAY')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    orderType === 'TAKEAWAY' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  С собой
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск блюда..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Categories */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-red-300 transition-all text-left group"
              >
                <div className="w-full h-24 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  {getProductIcon(product.name)}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-red-600 mt-2">
                  {formatPrice(product.price)} сум
                </p>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Блюда не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Текущий заказ</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Очистить
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span className="px-2 py-0.5 bg-gray-100 rounded">
              {orderType === 'DINE_IN' ? 'В зале' : 'С собой'}
            </span>
            <span>{cart.length} позиций</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Добавьте блюда в заказ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-gray-50 rounded-lg p-3 animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatPrice(item.product.price)} сум
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {/* Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Подытог</span>
              <span>{formatPrice(subtotal)} сум</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка</span>
                <span>-{formatPrice(discount)} сум</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Итого</span>
              <span>{formatPrice(total)} сум</span>
            </div>
          </div>

          {/* Payment Button */}
          {!showPayment ? (
            <button
              onClick={() => setShowPayment(true)}
              disabled={cart.length === 0}
              className="w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Оплата
            </button>
          ) : (
            <div className="space-y-3">
              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                        selectedPayment === method.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{method.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Confirm Payment */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPayment(false)
                    setSelectedPayment(null)
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={processPayment}
                  disabled={!selectedPayment || isProcessing}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Подтвердить
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Complete Modal */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-slide-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Заказ создан!</h2>
            <p className="text-gray-600 mb-4">Номер заказа</p>
            <div className="text-5xl font-bold text-red-600 mb-6">#{orderComplete}</div>
            <button
              onClick={() => setOrderComplete(null)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
