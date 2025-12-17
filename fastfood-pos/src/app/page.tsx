'use client'

import Link from 'next/link'
import {
  ShoppingCart,
  ChefHat,
  Monitor,
  LayoutDashboard,
  Package,
  Users,
  UtensilsCrossed,
  TrendingUp,
  Building2
} from 'lucide-react'

const modules = [
  {
    title: 'Дашборд',
    description: 'Аналитика и отчёты',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'bg-blue-500',
    roles: ['Директор', 'Менеджер'],
  },
  {
    title: 'POS Касса',
    description: 'Приём заказов и оплата',
    icon: ShoppingCart,
    href: '/pos',
    color: 'bg-red-500',
    roles: ['Кассир', 'Менеджер'],
  },
  {
    title: 'KDS Кухня',
    description: 'Экран повара',
    icon: ChefHat,
    href: '/kds',
    color: 'bg-orange-500',
    roles: ['Повар'],
  },
  {
    title: 'CDS Клиент',
    description: 'Табло готовности',
    icon: Monitor,
    href: '/cds',
    color: 'bg-green-500',
    roles: ['Публичный'],
  },
  {
    title: 'Меню',
    description: 'Управление блюдами',
    icon: UtensilsCrossed,
    href: '/menu',
    color: 'bg-purple-500',
    roles: ['Менеджер'],
  },
  {
    title: 'Склад',
    description: 'Остатки и приход',
    icon: Package,
    href: '/inventory',
    color: 'bg-amber-500',
    roles: ['Кладовщик', 'Менеджер'],
  },
  {
    title: 'Финансы',
    description: 'Доходы и расходы',
    icon: TrendingUp,
    href: '/finance',
    color: 'bg-emerald-500',
    roles: ['Бухгалтер', 'Директор'],
  },
  {
    title: 'Филиалы',
    description: 'Управление сетью',
    icon: Building2,
    href: '/branches',
    color: 'bg-indigo-500',
    roles: ['Директор'],
  },
  {
    title: 'Пользователи',
    description: 'Роли и доступ',
    icon: Users,
    href: '/users',
    color: 'bg-pink-500',
    roles: ['Админ'],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FastFood POS</h1>
                <p className="text-sm text-gray-500">Система управления фаст-фудом</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Филиал: <strong>FastFood Central</strong></span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Онлайн
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats - Dashboard */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Сводка за сегодня</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-500 mt-1">Заказов сегодня</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600">4,250,000</div>
              <div className="text-sm text-gray-500 mt-1">Выручка (сум)</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-gray-900">33,500</div>
              <div className="text-sm text-gray-500 mt-1">Средний чек</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-500">5</div>
              <div className="text-sm text-gray-500 mt-1">В очереди</div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Модули системы</h2>
          <p className="text-gray-600 mb-6">
            Выберите модуль для работы. Каждый модуль доступен в зависимости от вашей роли.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`${module.color} w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{module.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {module.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">FastFood POS MVP</h3>
              <p className="text-red-100 max-w-xl">
                Это MVP версия системы управления фаст-фуд рестораном.
                Включает POS, экран кухни (KDS), экран клиента (CDS),
                дашборд с аналитикой и управление меню.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl">🍔</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Поддерживаемые способы оплаты:</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">💳 Uzcard</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">💳 Humo</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">📱 Click</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">📱 Payme</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">📱 Uzum Bank</span>
            <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium">💵 Наличные</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>FastFood POS © 2024. MVP Version</span>
            <span>Разработано для Project Manager Case Study</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
