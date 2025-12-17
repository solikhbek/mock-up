'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Clock,
  Users,
  Plus,
  X,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  workingHours: string
  manager: string
  employees: number
  status: 'active' | 'inactive'
  todayRevenue: number
  todayOrders: number
}

const initialBranches: Branch[] = [
  { id: '1', name: 'FastFood Central', address: 'ул. Навои 25, Ташкент', phone: '+998 71 123 45 67', workingHours: '09:00 - 23:00', manager: 'Алишер Каримов', employees: 12, status: 'active', todayRevenue: 4250000, todayOrders: 127 },
  { id: '2', name: 'FastFood Yunusabad', address: 'ул. Амира Темура 88, Юнусабад', phone: '+998 71 234 56 78', workingHours: '10:00 - 22:00', manager: 'Дилшод Рахимов', employees: 8, status: 'active', todayRevenue: 2890000, todayOrders: 89 },
  { id: '3', name: 'FastFood Sergeli', address: 'ул. Фаргона йули 12, Сергели', phone: '+998 71 345 67 89', workingHours: '09:00 - 22:00', manager: 'Санжар Умаров', employees: 10, status: 'active', todayRevenue: 3150000, todayOrders: 98 },
]

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    workingHours: '09:00 - 22:00',
    manager: '',
    employees: 0,
    status: 'active' as 'active' | 'inactive'
  })

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price)

  const totalStats = {
    activeBranches: branches.filter(b => b.status === 'active').length,
    totalRevenue: branches.reduce((sum, b) => sum + b.todayRevenue, 0),
    totalOrders: branches.reduce((sum, b) => sum + b.todayOrders, 0),
    totalEmployees: branches.reduce((sum, b) => sum + b.employees, 0)
  }

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      ...formData,
      todayRevenue: 0,
      todayOrders: 0
    }
    setBranches([...branches, newBranch])
    setShowAddModal(false)
    resetForm()
  }

  const handleEditBranch = () => {
    if (!selectedBranch) return
    const updated = branches.map(b =>
      b.id === selectedBranch.id ? { ...b, ...formData } : b
    )
    setBranches(updated)
    setShowEditModal(false)
    setSelectedBranch(null)
    resetForm()
  }

  const handleDeleteBranch = (id: string) => {
    if (confirm('Удалить этот филиал?')) {
      setBranches(branches.filter(b => b.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setBranches(branches.map(b =>
      b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b
    ))
  }

  const openEditModal = (branch: Branch) => {
    setSelectedBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      workingHours: branch.workingHours,
      manager: branch.manager,
      employees: branch.employees,
      status: branch.status
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      workingHours: '09:00 - 22:00',
      manager: '',
      employees: 0,
      status: 'active'
    })
  }

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
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Филиалы</h1>
                  <p className="text-sm text-gray-500">Управление сетью ресторанов</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить филиал
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{totalStats.activeBranches}</div>
            <div className="text-sm text-gray-500">Активных филиалов</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalStats.totalRevenue)}</div>
            <div className="text-sm text-gray-500">Выручка сегодня (сум)</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{totalStats.totalOrders}</div>
            <div className="text-sm text-gray-500">Заказов сегодня</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{totalStats.totalEmployees}</div>
            <div className="text-sm text-gray-500">Сотрудников всего</div>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map(branch => (
            <div
              key={branch.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-all ${
                branch.status === 'active' ? 'border-transparent hover:border-indigo-200' : 'border-gray-200 opacity-75'
              }`}
            >
              {/* Branch Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      branch.status === 'active' ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        branch.status === 'active' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {branch.address}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(branch.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      branch.status === 'active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {branch.status === 'active' ? (
                      <><CheckCircle className="w-3 h-3" /> Работает</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Закрыт</>
                    )}
                  </button>
                </div>
              </div>

              {/* Branch Info */}
              <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {branch.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {branch.workingHours}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  {branch.employees} сотрудников
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">Менеджер:</span>
                  {branch.manager || 'Не назначен'}
                </div>
              </div>

              {/* Branch Stats */}
              {branch.status === 'active' && (
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">{formatPrice(branch.todayRevenue)}</div>
                      <div className="text-xs text-gray-500">Выручка сегодня</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{branch.todayOrders}</div>
                      <div className="text-xs text-gray-500">Заказов сегодня</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => openEditModal(branch)}
                  className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Добавить филиал</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="FastFood Chilanzar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ул. Катартал 7, Чиланзар"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+998 71 456 78 90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Часы работы</label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="09:00 - 22:00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Менеджер</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Имя менеджера"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудников</label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({...formData, employees: +e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleAddBranch} className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Редактировать филиал</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Часы работы</label>
                  <input
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Менеджер</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Сотрудников</label>
                  <input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({...formData, employees: +e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleEditBranch} className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
