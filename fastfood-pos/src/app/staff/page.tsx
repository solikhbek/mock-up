'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Clock,
  LogIn,
  LogOut,
  TrendingUp,
  Award,
  Calendar,
  ChefHat,
  ShoppingCart,
  Package,
  Star,
  Timer,
  DollarSign,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

interface Employee {
  id: string
  name: string
  role: 'cashier' | 'cook' | 'manager' | 'warehouse'
  branch: string
  phone: string
  isOnShift: boolean
  checkInTime: string | null
  checkOutTime: string | null
}

interface Shift {
  id: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string | null
  hoursWorked: number | null
  status: 'active' | 'completed' | 'late' | 'absent'
}

interface EmployeeKPI {
  employeeId: string
  ordersProcessed: number
  revenue: number
  avgOrderTime: number // minutes
  customerRating: number
  lateCount: number
  totalHoursThisWeek: number
  totalHoursThisMonth: number
}

const roleLabels: Record<string, string> = {
  cashier: 'Кассир',
  cook: 'Повар',
  manager: 'Менеджер',
  warehouse: 'Кладовщик'
}

const roleIcons: Record<string, any> = {
  cashier: ShoppingCart,
  cook: ChefHat,
  manager: TrendingUp,
  warehouse: Package
}

const roleColors: Record<string, string> = {
  cashier: 'bg-blue-100 text-blue-700',
  cook: 'bg-orange-100 text-orange-700',
  manager: 'bg-purple-100 text-purple-700',
  warehouse: 'bg-amber-100 text-amber-700'
}

// Demo data
const initialEmployees: Employee[] = [
  { id: '1', name: 'Азиз Каримов', role: 'cashier', branch: 'Central', phone: '+998 90 123 45 67', isOnShift: true, checkInTime: '08:55', checkOutTime: null },
  { id: '2', name: 'Малика Рахимова', role: 'cashier', branch: 'Central', phone: '+998 91 234 56 78', isOnShift: true, checkInTime: '09:02', checkOutTime: null },
  { id: '3', name: 'Бахтиёр Усмонов', role: 'cook', branch: 'Central', phone: '+998 93 345 67 89', isOnShift: true, checkInTime: '07:45', checkOutTime: null },
  { id: '4', name: 'Дилором Назарова', role: 'cook', branch: 'Central', phone: '+998 94 456 78 90', isOnShift: true, checkInTime: '07:50', checkOutTime: null },
  { id: '5', name: 'Санжар Алиев', role: 'cook', branch: 'Central', phone: '+998 95 567 89 01', isOnShift: false, checkInTime: null, checkOutTime: null },
  { id: '6', name: 'Нодира Хасанова', role: 'manager', branch: 'Central', phone: '+998 97 678 90 12', isOnShift: true, checkInTime: '08:30', checkOutTime: null },
  { id: '7', name: 'Фаррух Ибрагимов', role: 'warehouse', branch: 'Central', phone: '+998 99 789 01 23', isOnShift: false, checkInTime: null, checkOutTime: null },
  { id: '8', name: 'Гулнора Саидова', role: 'cashier', branch: 'Yunusabad', phone: '+998 90 890 12 34', isOnShift: true, checkInTime: '09:10', checkOutTime: null },
]

const initialShifts: Shift[] = [
  { id: '1', employeeId: '1', date: '2025-12-17', checkIn: '08:55', checkOut: null, hoursWorked: null, status: 'active' },
  { id: '2', employeeId: '2', date: '2025-12-17', checkIn: '09:02', checkOut: null, hoursWorked: null, status: 'late' },
  { id: '3', employeeId: '3', date: '2025-12-17', checkIn: '07:45', checkOut: null, hoursWorked: null, status: 'active' },
  { id: '4', employeeId: '1', date: '2025-12-16', checkIn: '08:58', checkOut: '18:05', hoursWorked: 9.1, status: 'completed' },
  { id: '5', employeeId: '2', date: '2025-12-16', checkIn: '09:15', checkOut: '18:00', hoursWorked: 8.75, status: 'completed' },
  { id: '6', employeeId: '3', date: '2025-12-16', checkIn: '07:50', checkOut: '16:00', hoursWorked: 8.2, status: 'completed' },
  { id: '7', employeeId: '1', date: '2025-12-15', checkIn: '09:00', checkOut: '18:00', hoursWorked: 9, status: 'completed' },
  { id: '8', employeeId: '1', date: '2025-12-14', checkIn: '08:55', checkOut: '18:10', hoursWorked: 9.25, status: 'completed' },
  { id: '9', employeeId: '1', date: '2025-12-13', checkIn: '09:00', checkOut: '18:00', hoursWorked: 9, status: 'completed' },
]

const initialKPIs: EmployeeKPI[] = [
  { employeeId: '1', ordersProcessed: 127, revenue: 5720000, avgOrderTime: 2.3, customerRating: 4.8, lateCount: 0, totalHoursThisWeek: 36.35, totalHoursThisMonth: 168 },
  { employeeId: '2', ordersProcessed: 98, revenue: 4250000, avgOrderTime: 2.8, customerRating: 4.5, lateCount: 3, totalHoursThisWeek: 35.5, totalHoursThisMonth: 152 },
  { employeeId: '3', ordersProcessed: 185, revenue: 0, avgOrderTime: 4.2, customerRating: 4.9, lateCount: 0, totalHoursThisWeek: 40, totalHoursThisMonth: 176 },
  { employeeId: '4', ordersProcessed: 172, revenue: 0, avgOrderTime: 4.5, customerRating: 4.7, lateCount: 1, totalHoursThisWeek: 38, totalHoursThisMonth: 165 },
  { employeeId: '5', ordersProcessed: 150, revenue: 0, avgOrderTime: 4.8, customerRating: 4.6, lateCount: 2, totalHoursThisWeek: 32, totalHoursThisMonth: 140 },
  { employeeId: '6', ordersProcessed: 45, revenue: 12500000, avgOrderTime: 0, customerRating: 4.9, lateCount: 0, totalHoursThisWeek: 45, totalHoursThisMonth: 180 },
  { employeeId: '7', ordersProcessed: 0, revenue: 0, avgOrderTime: 0, customerRating: 4.4, lateCount: 4, totalHoursThisWeek: 28, totalHoursThisMonth: 120 },
  { employeeId: '8', ordersProcessed: 89, revenue: 3850000, avgOrderTime: 2.5, customerRating: 4.6, lateCount: 2, totalHoursThisWeek: 34, totalHoursThisMonth: 145 },
]

export default function StaffPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [shifts, setShifts] = useState<Shift[]>(initialShifts)
  const [kpis] = useState<EmployeeKPI[]>(initialKPIs)
  const [selectedTab, setSelectedTab] = useState<'onshift' | 'all' | 'kpi' | 'history'>('onshift')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [filterRole, setFilterRole] = useState<string>('all')

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price)

  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const handleCheckIn = (employee: Employee) => {
    const currentTime = getCurrentTime()

    // Update employee
    setEmployees(prev => prev.map(e =>
      e.id === employee.id
        ? { ...e, isOnShift: true, checkInTime: currentTime, checkOutTime: null }
        : e
    ))

    // Add new shift
    const isLate = currentTime > '09:00'
    const newShift: Shift = {
      id: Date.now().toString(),
      employeeId: employee.id,
      date: new Date().toISOString().split('T')[0],
      checkIn: currentTime,
      checkOut: null,
      hoursWorked: null,
      status: isLate ? 'late' : 'active'
    }
    setShifts(prev => [newShift, ...prev])
  }

  const handleCheckOut = (employee: Employee) => {
    const currentTime = getCurrentTime()

    // Update employee
    setEmployees(prev => prev.map(e =>
      e.id === employee.id
        ? { ...e, isOnShift: false, checkOutTime: currentTime }
        : e
    ))

    // Update shift
    setShifts(prev => prev.map(s => {
      if (s.employeeId === employee.id && s.status === 'active' || s.status === 'late') {
        const checkInParts = s.checkIn.split(':')
        const checkOutParts = currentTime.split(':')
        const checkInMinutes = parseInt(checkInParts[0]) * 60 + parseInt(checkInParts[1])
        const checkOutMinutes = parseInt(checkOutParts[0]) * 60 + parseInt(checkOutParts[1])
        const hoursWorked = (checkOutMinutes - checkInMinutes) / 60

        return {
          ...s,
          checkOut: currentTime,
          hoursWorked: Math.round(hoursWorked * 100) / 100,
          status: 'completed' as const
        }
      }
      return s
    }))
  }

  const getEmployeeKPI = (employeeId: string) => {
    return kpis.find(k => k.employeeId === employeeId)
  }

  const getEmployeeShifts = (employeeId: string) => {
    return shifts.filter(s => s.employeeId === employeeId)
  }

  const onShiftEmployees = employees.filter(e => e.isOnShift)
  const filteredEmployees = filterRole === 'all'
    ? employees
    : employees.filter(e => e.role === filterRole)

  // Stats
  const totalOnShift = onShiftEmployees.length
  const totalEmployees = employees.length
  const lateToday = shifts.filter(s => s.date === '2025-12-17' && s.status === 'late').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Персонал</h1>
                  <p className="text-sm text-gray-500">Учёт рабочего времени и KPI</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Check-in / Check-out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">На смене сейчас</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{totalOnShift}</div>
            <div className="text-sm text-gray-500">из {totalEmployees} сотрудников</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Опоздали сегодня</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">{lateToday}</div>
            <div className="text-sm text-gray-500">после 09:00</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Кассиры</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {employees.filter(e => e.role === 'cashier' && e.isOnShift).length}
            </div>
            <div className="text-sm text-gray-500">на смене</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Повара</span>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {employees.filter(e => e.role === 'cook' && e.isOnShift).length}
            </div>
            <div className="text-sm text-gray-500">на смене</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-100 p-4">
            <div className="flex gap-2">
              {[
                { id: 'onshift', label: 'На смене', icon: Clock },
                { id: 'all', label: 'Все сотрудники', icon: Users },
                { id: 'kpi', label: 'KPI показатели', icon: TrendingUp },
                { id: 'history', label: 'История смен', icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* On Shift Tab */}
            {selectedTab === 'onshift' && (
              <div className="space-y-4">
                {onShiftEmployees.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Сейчас никого нет на смене
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {onShiftEmployees.map(employee => {
                      const Icon = roleIcons[employee.role]
                      const kpi = getEmployeeKPI(employee.id)
                      return (
                        <div key={employee.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleColors[employee.role]}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded ${roleColors[employee.role]}`}>
                                  {roleLabels[employee.role]}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              На смене
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-gray-500 text-xs">Вход</div>
                              <div className="font-semibold text-green-600">{employee.checkInTime}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-gray-500 text-xs">Заказов сегодня</div>
                              <div className="font-semibold">{kpi?.ordersProcessed || 0}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCheckOut(employee)}
                            className="w-full py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            Check-out
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* All Employees Tab */}
            {selectedTab === 'all' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setFilterRole('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm ${filterRole === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Все
                  </button>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setFilterRole(key)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${filterRole === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Сотрудник</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Должность</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Филиал</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Телефон</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Статус</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Часов/нед</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(employee => {
                        const kpi = getEmployeeKPI(employee.id)
                        const Icon = roleIcons[employee.role]
                        return (
                          <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${roleColors[employee.role]}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-medium">{employee.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${roleColors[employee.role]}`}>
                                {roleLabels[employee.role]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{employee.branch}</td>
                            <td className="py-3 px-4 text-gray-600">{employee.phone}</td>
                            <td className="py-3 px-4">
                              {employee.isOnShift ? (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1 w-fit">
                                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                  На смене с {employee.checkInTime}
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                  Не на смене
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium">{kpi?.totalHoursThisWeek || 0}ч</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {employee.isOnShift ? (
                                <button
                                  onClick={() => handleCheckOut(employee)}
                                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                                >
                                  Check-out
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCheckIn(employee)}
                                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                                >
                                  Check-in
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KPI Tab */}
            {selectedTab === 'kpi' && (
              <div className="space-y-6">
                {/* Cashiers KPI */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    KPI Кассиров
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.filter(e => e.role === 'cashier').map(employee => {
                      const kpi = getEmployeeKPI(employee.id)
                      if (!kpi) return null
                      return (
                        <div key={employee.id} className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                              <p className="text-sm text-gray-500">{employee.branch}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="text-xs text-gray-500 mb-1">Заказов</div>
                              <div className="text-xl font-bold text-blue-600">{kpi.ordersProcessed}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="text-xs text-gray-500 mb-1">Выручка</div>
                              <div className="text-lg font-bold text-green-600">{formatPrice(kpi.revenue)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="text-xs text-gray-500 mb-1">Ср. время заказа</div>
                              <div className="text-xl font-bold text-purple-600">{kpi.avgOrderTime} мин</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="text-xs text-gray-500 mb-1">Рейтинг</div>
                              <div className="text-xl font-bold text-yellow-600 flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {kpi.customerRating}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-blue-100 flex justify-between text-sm">
                            <span className="text-gray-500">Часов/месяц: <strong>{kpi.totalHoursThisMonth}ч</strong></span>
                            <span className={kpi.lateCount > 2 ? 'text-red-600' : 'text-gray-500'}>
                              Опозданий: <strong>{kpi.lateCount}</strong>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Cooks KPI */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-orange-600" />
                    KPI Поваров
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.filter(e => e.role === 'cook').map(employee => {
                      const kpi = getEmployeeKPI(employee.id)
                      if (!kpi) return null
                      return (
                        <div key={employee.id} className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                              <ChefHat className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                              <p className="text-sm text-gray-500">{employee.branch}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-orange-100">
                              <div className="text-xs text-gray-500 mb-1">Блюд приготовлено</div>
                              <div className="text-xl font-bold text-orange-600">{kpi.ordersProcessed}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-100">
                              <div className="text-xs text-gray-500 mb-1">Ср. время готовки</div>
                              <div className="text-xl font-bold text-purple-600">{kpi.avgOrderTime} мин</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-100">
                              <div className="text-xs text-gray-500 mb-1">Часов/неделя</div>
                              <div className="text-xl font-bold text-blue-600">{kpi.totalHoursThisWeek}ч</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-orange-100">
                              <div className="text-xs text-gray-500 mb-1">Рейтинг</div>
                              <div className="text-xl font-bold text-yellow-600 flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {kpi.customerRating}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-orange-100 flex justify-between text-sm">
                            <span className="text-gray-500">Часов/месяц: <strong>{kpi.totalHoursThisMonth}ч</strong></span>
                            <span className={kpi.lateCount > 2 ? 'text-red-600' : 'text-gray-500'}>
                              Опозданий: <strong>{kpi.lateCount}</strong>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {selectedTab === 'history' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Дата</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Сотрудник</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Check-in</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Check-out</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Отработано</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.map(shift => {
                        const employee = employees.find(e => e.id === shift.employeeId)
                        if (!employee) return null
                        return (
                          <tr key={shift.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{shift.date}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span>{employee.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${roleColors[employee.role]}`}>
                                  {roleLabels[employee.role]}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="flex items-center gap-1 text-green-600">
                                <LogIn className="w-4 h-4" />
                                {shift.checkIn}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {shift.checkOut ? (
                                <span className="flex items-center gap-1 text-red-600">
                                  <LogOut className="w-4 h-4" />
                                  {shift.checkOut}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {shift.hoursWorked ? (
                                <span className="font-medium">{shift.hoursWorked}ч</span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {shift.status === 'active' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Активна</span>
                              )}
                              {shift.status === 'completed' && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Завершена</span>
                              )}
                              {shift.status === 'late' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Опоздание</span>
                              )}
                              {shift.status === 'absent' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Отсутствие</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Check-in/Check-out Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Check-in / Check-out</h2>
                <button
                  onClick={() => setShowCheckInModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Текущее время: {getCurrentTime()}</p>
            </div>

            <div className="p-6 space-y-3">
              {employees.map(employee => {
                const Icon = roleIcons[employee.role]
                return (
                  <div key={employee.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${roleColors[employee.role]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{roleLabels[employee.role]}</div>
                      </div>
                    </div>

                    {employee.isOnShift ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">с {employee.checkInTime}</span>
                        <button
                          onClick={() => {
                            handleCheckOut(employee)
                            setShowCheckInModal(false)
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1 text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Выход
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          handleCheckIn(employee)
                          setShowCheckInModal(false)
                        }}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-1 text-sm"
                      >
                        <LogIn className="w-4 h-4" />
                        Вход
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
