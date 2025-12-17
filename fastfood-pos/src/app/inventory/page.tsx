'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Plus,
  Minus,
  AlertTriangle,
  Search,
  X,
  Edit,
  Trash2
} from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  costPerUnit: number
  lastUpdated: string
  status: 'ok' | 'low' | 'critical'
}

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Булочки для бургеров', category: 'Хлеб', unit: 'шт', currentStock: 150, minStock: 50, maxStock: 300, costPerUnit: 1500, lastUpdated: '2025-12-17', status: 'ok' },
  { id: '2', name: 'Котлеты говяжьи', category: 'Мясо', unit: 'шт', currentStock: 80, minStock: 30, maxStock: 200, costPerUnit: 8000, lastUpdated: '2025-12-17', status: 'ok' },
  { id: '3', name: 'Котлеты куриные', category: 'Мясо', unit: 'шт', currentStock: 25, minStock: 30, maxStock: 150, costPerUnit: 6000, lastUpdated: '2025-12-16', status: 'low' },
  { id: '4', name: 'Сыр чеддер', category: 'Молочка', unit: 'кг', currentStock: 5, minStock: 10, maxStock: 30, costPerUnit: 85000, lastUpdated: '2025-12-17', status: 'critical' },
  { id: '5', name: 'Салат айсберг', category: 'Овощи', unit: 'кг', currentStock: 12, minStock: 5, maxStock: 25, costPerUnit: 25000, lastUpdated: '2025-12-17', status: 'ok' },
  { id: '6', name: 'Помидоры', category: 'Овощи', unit: 'кг', currentStock: 8, minStock: 5, maxStock: 20, costPerUnit: 18000, lastUpdated: '2025-12-17', status: 'ok' },
  { id: '7', name: 'Картофель фри (замор.)', category: 'Заморозка', unit: 'кг', currentStock: 15, minStock: 20, maxStock: 50, costPerUnit: 22000, lastUpdated: '2025-12-16', status: 'low' },
  { id: '8', name: 'Coca-Cola 0.5л', category: 'Напитки', unit: 'шт', currentStock: 200, minStock: 100, maxStock: 500, costPerUnit: 6500, lastUpdated: '2025-12-17', status: 'ok' },
]

const categories = ['Все', 'Хлеб', 'Мясо', 'Молочка', 'Овощи', 'Заморозка', 'Напитки', 'Масла', 'Соусы']
const units = ['шт', 'кг', 'л', 'уп']

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [showLowStock, setShowLowStock] = useState(false)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [stockAction, setStockAction] = useState<'add' | 'remove'>('add')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [stockAmount, setStockAmount] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Хлеб',
    unit: 'шт',
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    costPerUnit: 0
  })

  const calculateStatus = (current: number, min: number): 'ok' | 'low' | 'critical' => {
    if (current <= min * 0.5) return 'critical'
    if (current <= min) return 'low'
    return 'ok'
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory
    const matchesLowStock = !showLowStock || item.status !== 'ok'
    return matchesSearch && matchesCategory && matchesLowStock
  })

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(i => i.status === 'low').length,
    critical: inventory.filter(i => i.status === 'critical').length,
    totalValue: inventory.reduce((sum, i) => sum + (i.currentStock * i.costPerUnit), 0)
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price)

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: calculateStatus(formData.currentStock, formData.minStock)
    }
    setInventory([...inventory, newItem])
    setShowAddModal(false)
    setFormData({ name: '', category: 'Хлеб', unit: 'шт', currentStock: 0, minStock: 0, maxStock: 100, costPerUnit: 0 })
  }

  const handleEditItem = () => {
    if (!selectedItem) return
    const updated = inventory.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          ...formData,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: calculateStatus(formData.currentStock, formData.minStock)
        }
      }
      return item
    })
    setInventory(updated)
    setShowEditModal(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Удалить позицию со склада?')) {
      setInventory(inventory.filter(item => item.id !== id))
    }
  }

  const handleStockChange = () => {
    if (!selectedItem) return
    const updated = inventory.map(item => {
      if (item.id === selectedItem.id) {
        const newStock = stockAction === 'add'
          ? item.currentStock + stockAmount
          : Math.max(0, item.currentStock - stockAmount)
        return {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: calculateStatus(newStock, item.minStock)
        }
      }
      return item
    })
    setInventory(updated)
    setShowStockModal(false)
    setSelectedItem(null)
    setStockAmount(0)
  }

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      costPerUnit: item.costPerUnit
    })
    setShowEditModal(true)
  }

  const openStockModal = (item: InventoryItem, action: 'add' | 'remove') => {
    setSelectedItem(item)
    setStockAction(action)
    setStockAmount(0)
    setShowStockModal(true)
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
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Склад</h1>
                  <p className="text-sm text-gray-500">Остатки и движение товаров</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить товар
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
            <div className="text-sm text-gray-500">Позиций на складе</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-500">{stats.lowStock}</div>
            <div className="text-sm text-gray-500">Заканчивается</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
            <div className="text-sm text-gray-500">Критично мало</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</div>
            <div className="text-sm text-gray-500">Стоимость (сум)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                showLowStock
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Мало на складе
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Название</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Категория</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Остаток</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Цена за ед.</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Статус</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.category}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold">{item.currentStock}</span>
                    <span className="text-gray-500 text-sm ml-1">{item.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatPrice(item.costPerUnit)} сум
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.status === 'ok' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">В норме</span>
                    )}
                    {item.status === 'low' && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Заканчивается</span>
                    )}
                    {item.status === 'critical' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Критично</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openStockModal(item, 'add')}
                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        title="Приход"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openStockModal(item, 'remove')}
                        className="p-1.5 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                        title="Расход"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Добавить товар</h3>
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Введите название"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.filter(c => c !== 'Все').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Единица</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Остаток</label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: +e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Мин.</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: +e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Макс.</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({...formData, maxStock: +e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена за единицу (сум)</label>
                <input
                  type="number"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData({...formData, costPerUnit: +e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleAddItem} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Редактировать товар</h3>
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.filter(c => c !== 'Все').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Единица</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена за единицу (сум)</label>
                <input
                  type="number"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData({...formData, costPerUnit: +e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleEditItem} className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Change Modal */}
      {showStockModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {stockAction === 'add' ? 'Приход товара' : 'Расход товара'}
              </h3>
              <button onClick={() => setShowStockModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">{selectedItem.name}</p>
              <p className="text-sm text-gray-500">Текущий остаток: {selectedItem.currentStock} {selectedItem.unit}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество ({selectedItem.unit})
              </label>
              <input
                type="number"
                value={stockAmount}
                onChange={(e) => setStockAmount(+e.target.value)}
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowStockModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button
                onClick={handleStockChange}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  stockAction === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {stockAction === 'add' ? 'Добавить' : 'Списать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
