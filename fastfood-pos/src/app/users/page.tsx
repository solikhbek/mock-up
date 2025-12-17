'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  Shield,
  Mail,
  Phone,
  Building2,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  branch: string
  status: 'active' | 'inactive'
  pin?: string
}

const initialUsers: User[] = [
  { id: '1', name: 'Админ Системы', email: 'admin@fastfood.uz', phone: '+998 90 123 45 67', role: 'Админ', branch: 'Все филиалы', status: 'active' },
  { id: '2', name: 'Алишер Каримов', email: 'director@fastfood.uz', phone: '+998 90 234 56 78', role: 'Директор', branch: 'Все филиалы', status: 'active' },
  { id: '3', name: 'Дилшод Рахимов', email: 'manager@fastfood.uz', phone: '+998 90 345 67 89', role: 'Менеджер', branch: 'Central', status: 'active' },
  { id: '4', name: 'Азиза Ташпулатова', email: 'cashier1@fastfood.uz', phone: '+998 90 456 78 90', role: 'Кассир', branch: 'Central', status: 'active', pin: '1234' },
  { id: '5', name: 'Бахтиёр Юсупов', email: 'cashier2@fastfood.uz', phone: '+998 90 567 89 01', role: 'Кассир', branch: 'Yunusabad', status: 'active', pin: '5678' },
  { id: '6', name: 'Шухрат Мирзаев', email: 'cook@fastfood.uz', phone: '+998 90 678 90 12', role: 'Повар', branch: 'Central', status: 'active' },
  { id: '7', name: 'Нодира Абдуллаева', email: 'accountant@fastfood.uz', phone: '+998 90 789 01 23', role: 'Бухгалтер', branch: 'Все филиалы', status: 'active' },
  { id: '8', name: 'Равшан Исмаилов', email: 'warehouse@fastfood.uz', phone: '+998 90 890 12 34', role: 'Кладовщик', branch: 'Central', status: 'inactive' },
]

const roles = ['Админ', 'Директор', 'Менеджер', 'Кассир', 'Повар', 'Бухгалтер', 'Кладовщик']
const branches = ['Все филиалы', 'Central', 'Yunusabad', 'Sergeli']

const roleColors: Record<string, string> = {
  'Админ': 'bg-red-100 text-red-700',
  'Директор': 'bg-purple-100 text-purple-700',
  'Менеджер': 'bg-blue-100 text-blue-700',
  'Кассир': 'bg-green-100 text-green-700',
  'Повар': 'bg-orange-100 text-orange-700',
  'Бухгалтер': 'bg-emerald-100 text-emerald-700',
  'Кладовщик': 'bg-amber-100 text-amber-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('Все')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Кассир',
    branch: 'Central',
    pin: '',
    status: 'active' as 'active' | 'inactive'
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'Все' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
  }

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      branch: formData.branch,
      status: formData.status,
      pin: formData.pin || undefined
    }
    setUsers([...users, newUser])
    setShowAddModal(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    const updated = users.map(u =>
      u.id === selectedUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        branch: formData.branch,
        status: formData.status,
        pin: formData.pin || undefined
      } : u
    )
    setUsers(updated)
    setShowEditModal(false)
    setSelectedUser(null)
    resetForm()
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Удалить этого пользователя?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      branch: user.branch,
      pin: user.pin || '',
      status: user.status
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Кассир',
      branch: 'Central',
      pin: '',
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
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Пользователи</h1>
                  <p className="text-sm text-gray-500">Управление доступом и ролями</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Добавить
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Всего пользователей</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-500">Активных</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
            <div className="text-sm text-gray-500">Неактивных</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedRole('Все')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRole === 'Все'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Все
              </button>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === role
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Пользователь</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Контакты</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Роль</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Филиал</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Статус</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.pin && (
                          <div className="text-xs text-gray-500">PIN: ****</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Building2 className="w-3 h-3" />
                      {user.branch}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <><CheckCircle className="w-3 h-3" /> Активен</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> Неактивен</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
              <h3 className="text-lg font-semibold">Добавить пользователя</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Имя Фамилия"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="email@fastfood.uz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Филиал</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(formData.role === 'Кассир') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN-код (для кассиров)</label>
                  <input
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="4 цифры"
                    maxLength={4}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleAddUser} className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Редактировать пользователя</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Филиал</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              {(formData.role === 'Кассир') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIN-код</label>
                  <input
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    maxLength={4}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Отмена
              </button>
              <button onClick={handleEditUser} className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
