'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Save,
  UtensilsCrossed
} from 'lucide-react'

interface Category {
  id: string
  name: string
  nameUz?: string
  icon?: string
  sortOrder: number
  isActive: boolean
  _count?: {
    products: number
  }
}

interface Product {
  id: string
  name: string
  nameUz?: string
  description?: string
  price: number
  categoryId: string
  isActive: boolean
  inStock: boolean
  category: Category
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    nameUz: '',
    description: '',
    price: '',
    categoryId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ])
      const cats = await catRes.json()
      const prods = await prodRes.json()
      setCategories(cats)
      setProducts(prods)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameUz?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  // Функция для определения иконки по названию продукта
  const getProductIcon = (name: string, categoryName?: string): string => {
    const lowerName = name.toLowerCase()
    const lowerCategory = categoryName?.toLowerCase() || ''

    // Бургеры
    if (lowerName.includes('бургер') || lowerName.includes('burger') || lowerName.includes('биг мак') || lowerName.includes('воппер') || lowerName.includes('гамбургер')) {
      return '🍔'
    }
    // Хот-доги
    if (lowerName.includes('хот-дог') || lowerName.includes('хотдог') || lowerName.includes('hot dog') || lowerName.includes('hotdog')) {
      return '🌭'
    }
    // Сэндвичи и роллы
    if (lowerName.includes('сэндвич') || lowerName.includes('сендвич') || lowerName.includes('sandwich') || lowerName.includes('ролл') || lowerName.includes('wrap') || lowerName.includes('шаурма') || lowerName.includes('донер')) {
      return '🥪'
    }
    // Пицца
    if (lowerName.includes('пицца') || lowerName.includes('pizza')) {
      return '🍕'
    }
    // Картофель фри
    if (lowerName.includes('фри') || lowerName.includes('картофель') || lowerName.includes('картошка') || lowerName.includes('fries') || lowerName.includes('potato')) {
      return '🍟'
    }
    // Наггетсы и куриные блюда
    if (lowerName.includes('наггетс') || lowerName.includes('нагетс') || lowerName.includes('nugget') || lowerName.includes('стрипс') || lowerName.includes('крылышки') || lowerName.includes('wings')) {
      return '🍗'
    }
    // Курица
    if (lowerName.includes('куриц') || lowerName.includes('курин') || lowerName.includes('chicken') || lowerName.includes('цыпл')) {
      return '🍗'
    }
    // Салаты
    if (lowerName.includes('салат') || lowerName.includes('salad') || lowerCategory.includes('салат')) {
      return '🥗'
    }
    // Кола и газировки
    if (lowerName.includes('кола') || lowerName.includes('cola') || lowerName.includes('пепси') || lowerName.includes('pepsi') || lowerName.includes('спрайт') || lowerName.includes('sprite') || lowerName.includes('фанта') || lowerName.includes('fanta') || lowerName.includes('газировка')) {
      return '🥤'
    }
    // Соки
    if (lowerName.includes('сок') || lowerName.includes('juice') || lowerName.includes('нектар')) {
      return '🧃'
    }
    // Кофе
    if (lowerName.includes('кофе') || lowerName.includes('coffee') || lowerName.includes('латте') || lowerName.includes('капучино') || lowerName.includes('американо') || lowerName.includes('эспрессо')) {
      return '☕'
    }
    // Чай
    if (lowerName.includes('чай') || lowerName.includes('tea')) {
      return '🍵'
    }
    // Молочные коктейли
    if (lowerName.includes('коктейль') || lowerName.includes('милкшейк') || lowerName.includes('shake') || lowerName.includes('смузи') || lowerName.includes('smoothie')) {
      return '🥛'
    }
    // Мороженое
    if (lowerName.includes('мороженое') || lowerName.includes('морожен') || lowerName.includes('ice cream') || lowerName.includes('айс крим') || lowerName.includes('пломбир') || lowerName.includes('санде') || lowerName.includes('sundae') || lowerName.includes('макфлурри')) {
      return '🍦'
    }
    // Десерты и выпечка
    if (lowerName.includes('пирог') || lowerName.includes('pie') || lowerName.includes('торт') || lowerName.includes('cake') || lowerName.includes('маффин') || lowerName.includes('muffin') || lowerName.includes('кекс')) {
      return '🍰'
    }
    // Пончики
    if (lowerName.includes('пончик') || lowerName.includes('donut') || lowerName.includes('донат')) {
      return '🍩'
    }
    // Печенье
    if (lowerName.includes('печень') || lowerName.includes('cookie')) {
      return '🍪'
    }
    // Тако
    if (lowerName.includes('тако') || lowerName.includes('taco')) {
      return '🌮'
    }
    // Буррито
    if (lowerName.includes('буррито') || lowerName.includes('burrito')) {
      return '🌯'
    }
    // Рис
    if (lowerName.includes('рис') || lowerName.includes('rice') || lowerName.includes('плов')) {
      return '🍚'
    }
    // Лапша
    if (lowerName.includes('лапша') || lowerName.includes('noodle') || lowerName.includes('вок') || lowerName.includes('wok')) {
      return '🍜'
    }
    // Соусы
    if (lowerName.includes('соус') || lowerName.includes('sauce') || lowerName.includes('кетчуп') || lowerName.includes('майонез')) {
      return '🫙'
    }
    // Вода
    if (lowerName.includes('вода') || lowerName.includes('water') || lowerName.includes('минерал')) {
      return '💧'
    }
    // По категории напитки
    if (lowerCategory.includes('напит') || lowerCategory.includes('drink') || lowerCategory.includes('beverage')) {
      return '🥤'
    }
    // По категории десерты
    if (lowerCategory.includes('десерт') || lowerCategory.includes('dessert') || lowerCategory.includes('сладк')) {
      return '🍰'
    }
    // По категории завтраки
    if (lowerCategory.includes('завтрак') || lowerCategory.includes('breakfast')) {
      return '🍳'
    }

    // По умолчанию - тарелка с едой
    return '🍽️'
  }

  const resetForm = () => {
    setFormData({ name: '', nameUz: '', description: '', price: '', categoryId: '' })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
        }),
      })

      if (res.ok) {
        fetchData()
        setShowAddProduct(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      // Since API might not have PATCH for products, update locally
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                nameUz: formData.nameUz,
                description: formData.description,
                price: parseInt(formData.price),
                categoryId: formData.categoryId,
                category: categories.find(c => c.id === formData.categoryId) || p.category
              }
            : p
        )
      )
      setShowEditProduct(false)
      setEditingProduct(null)
      resetForm()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      nameUz: product.nameUz || '',
      description: product.description || '',
      price: product.price.toString(),
      categoryId: product.categoryId,
    })
    setShowEditProduct(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Удалить это блюдо из меню?')) {
      setProducts(prev => prev.filter(p => p.id !== productId))
    }
  }

  const toggleProductStock = (product: Product) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === product.id ? { ...p, inStock: !p.inStock } : p
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка меню...</p>
        </div>
      </div>
    )
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
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Управление меню</h1>
                  <p className="text-sm text-gray-500">{products.length} блюд в {categories.length} категориях</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск блюда..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Добавить блюдо
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Категории</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Все блюда
                  <span className="float-right text-gray-400">{products.length}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.icon} {category.name}
                    <span className="float-right text-gray-400">{category._count?.products || 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Блюда не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                      !product.inStock ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Product Image Placeholder */}
                    <div className="h-32 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-5xl relative">
                      {getProductIcon(product.name, product.category?.name)}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Стоп-лист
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          {product.nameUz && (
                            <p className="text-sm text-gray-500">{product.nameUz}</p>
                          )}
                        </div>
                      </div>

                      {product.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-600">
                          {formatPrice(product.price)} сум
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleProductStock(product)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.inStock
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                            }`}
                            title={product.inStock ? 'В наличии' : 'Стоп-лист'}
                          >
                            {product.inStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {product.category.icon} {product.category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Добавить блюдо</h2>
                <button
                  onClick={() => { setShowAddProduct(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название (рус)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название (узб)</label>
                <input
                  type="text"
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (сум)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddProduct(false); resetForm(); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Редактировать блюдо</h2>
                <button
                  onClick={() => { setShowEditProduct(false); setEditingProduct(null); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название (рус)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название (узб)</label>
                <input
                  type="text"
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (сум)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditProduct(false); setEditingProduct(null); resetForm(); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
