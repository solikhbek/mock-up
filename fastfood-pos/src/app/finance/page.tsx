'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  X,
  Edit,
  Trash2
} from 'lucide-react'

interface Transaction {
  id: string
  date: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  branch: string
}

const initialTransactions: Transaction[] = [
  { id: '1', date: '2025-12-17', type: 'income', category: 'Продажи', description: 'Дневная выручка - Central', amount: 4250000, branch: 'Central' },
  { id: '2', date: '2025-12-17', type: 'income', category: 'Продажи', description: 'Дневная выручка - Yunusabad', amount: 2890000, branch: 'Yunusabad' },
  { id: '3', date: '2025-12-17', type: 'expense', category: 'Закупки', description: 'Продукты от поставщика "Агро"', amount: 1850000, branch: 'Central' },
  { id: '4', date: '2025-12-17', type: 'expense', category: 'Зарплата', description: 'Аванс сотрудникам', amount: 3500000, branch: 'Все' },
  { id: '5', date: '2025-12-17', type: 'expense', category: 'Коммунальные', description: 'Электричество - Central', amount: 450000, branch: 'Central' },
  { id: '6', date: '2025-12-16', type: 'income', category: 'Продажи', description: 'Дневная выручка - Central', amount: 3980000, branch: 'Central' },
  { id: '7', date: '2025-12-16', type: 'income', category: 'Продажи', description: 'Дневная выручка - Sergeli', amount: 3150000, branch: 'Sergeli' },
  { id: '8', date: '2025-12-16', type: 'expense', category: 'Закупки', description: 'Напитки от "Coca-Cola"', amount: 980000, branch: 'Все' },
]

const incomeCategories = ['Продажи', 'Возврат', 'Прочие доходы']
const expenseCategories = ['Закупки', 'Зарплата', 'Аренда', 'Коммунальные', 'Налоги', 'Прочие расходы']
const branches = ['Central', 'Yunusabad', 'Sergeli', 'Все']

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: 'Продажи',
    description: '',
    amount: 0,
    branch: 'Central',
    date: new Date().toISOString().split('T')[0]
  })

  const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price)

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const profit = totalIncome - totalExpense

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true
    return t.type === filterType
  })

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...formData
    }
    setTransactions([newTransaction, ...transactions])
    setShowAddModal(false)
    resetForm()
  }

  const handleEditTransaction = () => {
    if (!selectedTransaction) return
    const updated = transactions.map(t =>
      t.id === selectedTransaction.id ? { ...t, ...formData } : t
    )
    setTransactions(updated)
    setShowEditModal(false)
    setSelectedTransaction(null)
    resetForm()
  }

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Удалить эту операцию?')) {
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  const openEditModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setFormData({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      branch: transaction.branch,
      date: transaction.date
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: 'Продажи',
      description: '',
      amount: 0,
      branch: 'Central',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const openAddModal = (type: 'income' | 'expense') => {
    setFormData({
      ...formData,
      type,
      category: type === 'income' ? 'Продажи' : 'Закупки'
    })
    setShowAddModal(true)
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
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Финансы</h1>
                  <p className="text-sm text-gray-500">Доходы, расходы и прибыль</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openAddModal('income')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                Доход
              </button>
              <button
                onClick={() => openAddModal('expense')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <ArrowDownRight className="w-4 h-4" />
                Расход
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Доходы</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{formatPrice(totalIncome)}</div>
            <div className="text-sm text-gray-500 mt-1">сум</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Расходы</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">{formatPrice(totalExpense)}</div>
            <div className="text-sm text-gray-500 mt-1">сум</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100">Чистая прибыль</span>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold">{formatPrice(profit)}</div>
            <div className="text-emerald-100 text-sm mt-1">
              Маржа: {totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex gap-2">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? type === 'income' ? 'bg-green-100 text-green-700'
                      : type === 'expense' ? 'bg-red-100 text-red-700'
                      : 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Все операции' : type === 'income' ? 'Доходы' : 'Расходы'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.branch}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`font-semibold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatPrice(transaction.amount)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(transaction)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {formData.type === 'income' ? 'Добавить доход' : 'Добавить расход'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({...formData, type: 'income', category: 'Продажи'})}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Доход
                  </button>
                  <button
                    onClick={() => setFormData({...formData, type: 'expense', category: 'Закупки'})}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Расход
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Введите описание"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (сум)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: +e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Филиал</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button
                onClick={handleAddTransaction}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  formData.type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Редактировать операцию</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сумма (сум)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: +e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Филиал</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleEditTransaction} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
