import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.orderItemModifier.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.shift.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.inventoryItem.deleteMany()
  await prisma.productIngredient.deleteMany()
  await prisma.productModifier.deleteMany()
  await prisma.modifier.deleteMany()
  await prisma.modifierGroup.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.user.deleteMany()
  await prisma.branch.deleteMany()

  // ==================== BRANCHES ====================
  console.log('Creating branches...')
  const branch1 = await prisma.branch.create({
    data: {
      name: 'FastFood Central',
      address: 'ул. Навои, 25, Ташкент',
      phone: '+998 90 123 45 67',
    },
  })

  const branch2 = await prisma.branch.create({
    data: {
      name: 'FastFood Yunusabad',
      address: 'ул. Янги Шахар, 12, Ташкент',
      phone: '+998 90 234 56 78',
    },
  })

  const branch3 = await prisma.branch.create({
    data: {
      name: 'FastFood Sergeli',
      address: 'ул. Сергели, 45, Ташкент',
      phone: '+998 90 345 67 89',
    },
  })

  // ==================== USERS ====================
  console.log('Creating users...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fastfood.uz',
      name: 'Админ Системы',
      password: 'admin123',
      role: 'SUPER_ADMIN',
    },
  })

  const director = await prisma.user.create({
    data: {
      email: 'director@fastfood.uz',
      name: 'Алишер Каримов',
      password: 'director123',
      role: 'DIRECTOR',
    },
  })

  const manager1 = await prisma.user.create({
    data: {
      email: 'manager1@fastfood.uz',
      name: 'Азиза Рахимова',
      password: 'manager123',
      role: 'MANAGER',
      branchId: branch1.id,
    },
  })

  const cashier1 = await prisma.user.create({
    data: {
      email: 'cashier1@fastfood.uz',
      name: 'Дильнора Усманова',
      password: 'cashier123',
      pin: '1234',
      role: 'CASHIER',
      branchId: branch1.id,
    },
  })

  const cashier2 = await prisma.user.create({
    data: {
      email: 'cashier2@fastfood.uz',
      name: 'Бахтиёр Назаров',
      password: 'cashier123',
      pin: '5678',
      role: 'CASHIER',
      branchId: branch1.id,
    },
  })

  const cook1 = await prisma.user.create({
    data: {
      email: 'cook1@fastfood.uz',
      name: 'Санжар Алиев',
      password: 'cook123',
      role: 'COOK',
      branchId: branch1.id,
    },
  })

  // ==================== CATEGORIES ====================
  console.log('Creating categories...')
  const burgers = await prisma.category.create({
    data: { name: 'Бургеры', nameUz: 'Burgerlar', icon: '🍔', sortOrder: 1 },
  })

  const sandwiches = await prisma.category.create({
    data: { name: 'Сэндвичи', nameUz: 'Sendvichlar', icon: '🥪', sortOrder: 2 },
  })

  const sides = await prisma.category.create({
    data: { name: 'Гарниры', nameUz: 'Garnirlar', icon: '🍟', sortOrder: 3 },
  })

  const drinks = await prisma.category.create({
    data: { name: 'Напитки', nameUz: 'Ichimliklar', icon: '🥤', sortOrder: 4 },
  })

  const desserts = await prisma.category.create({
    data: { name: 'Десерты', nameUz: 'Desertlar', icon: '🍦', sortOrder: 5 },
  })

  const combo = await prisma.category.create({
    data: { name: 'Комбо', nameUz: 'Kombo', icon: '🎁', sortOrder: 0 },
  })

  // ==================== MODIFIER GROUPS ====================
  console.log('Creating modifier groups...')
  const sauces = await prisma.modifierGroup.create({
    data: {
      name: 'Соусы',
      nameUz: 'Souslar',
      isRequired: false,
      minSelect: 0,
      maxSelect: 3,
    },
  })

  const extras = await prisma.modifierGroup.create({
    data: {
      name: 'Добавки',
      nameUz: "Qo'shimchalar",
      isRequired: false,
      minSelect: 0,
      maxSelect: 5,
    },
  })

  const sizes = await prisma.modifierGroup.create({
    data: {
      name: 'Размер',
      nameUz: "O'lcham",
      isRequired: true,
      minSelect: 1,
      maxSelect: 1,
    },
  })

  // ==================== MODIFIERS ====================
  console.log('Creating modifiers...')
  await prisma.modifier.createMany({
    data: [
      { name: 'Кетчуп', nameUz: 'Ketchup', price: 0, modifierGroupId: sauces.id },
      { name: 'Майонез', nameUz: 'Mayonez', price: 0, modifierGroupId: sauces.id },
      { name: 'Горчица', nameUz: 'Gorchitsa', price: 0, modifierGroupId: sauces.id },
      { name: 'BBQ соус', nameUz: 'BBQ sous', price: 2000, modifierGroupId: sauces.id },
      { name: 'Чесночный соус', nameUz: 'Sarimsoqli sous', price: 2000, modifierGroupId: sauces.id },
    ],
  })

  await prisma.modifier.createMany({
    data: [
      { name: 'Двойной сыр', nameUz: 'Ikki hissa pishloq', price: 5000, modifierGroupId: extras.id },
      { name: 'Бекон', nameUz: 'Bekon', price: 8000, modifierGroupId: extras.id },
      { name: 'Яйцо', nameUz: 'Tuxum', price: 3000, modifierGroupId: extras.id },
      { name: 'Халапеньо', nameUz: 'Xalapeno', price: 2000, modifierGroupId: extras.id },
      { name: 'Без лука', nameUz: 'Piyozsiz', price: 0, modifierGroupId: extras.id },
    ],
  })

  await prisma.modifier.createMany({
    data: [
      { name: 'Маленький', nameUz: 'Kichik', price: 0, modifierGroupId: sizes.id },
      { name: 'Средний', nameUz: "O'rtacha", price: 5000, modifierGroupId: sizes.id },
      { name: 'Большой', nameUz: 'Katta', price: 10000, modifierGroupId: sizes.id },
    ],
  })

  // ==================== PRODUCTS ====================
  console.log('Creating products...')

  const classicBurger = await prisma.product.create({
    data: {
      name: 'Классик Бургер',
      nameUz: 'Klassik Burger',
      description: 'Сочная говяжья котлета, свежие овощи, фирменный соус',
      price: 28000,
      categoryId: burgers.id,
      sortOrder: 1,
    },
  })

  const cheeseBurger = await prisma.product.create({
    data: {
      name: 'Чизбургер',
      nameUz: 'Chizburger',
      description: 'Говяжья котлета с двойным сыром чеддер',
      price: 32000,
      categoryId: burgers.id,
      sortOrder: 2,
    },
  })

  const doubleBurger = await prisma.product.create({
    data: {
      name: 'Двойной Бургер',
      nameUz: 'Ikki qavatli Burger',
      description: 'Две говяжьи котлеты, сыр, бекон, специальный соус',
      price: 45000,
      categoryId: burgers.id,
      sortOrder: 3,
    },
  })

  const chickenBurger = await prisma.product.create({
    data: {
      name: 'Чикен Бургер',
      nameUz: 'Tovuqli Burger',
      description: 'Хрустящая куриная котлета, салат, томаты',
      price: 26000,
      categoryId: burgers.id,
      sortOrder: 4,
    },
  })

  const spicyBurger = await prisma.product.create({
    data: {
      name: 'Острый Бургер',
      nameUz: 'Achchiq Burger',
      description: 'Говяжья котлета с халапеньо и острым соусом',
      price: 30000,
      categoryId: burgers.id,
      sortOrder: 5,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Клаб Сэндвич',
      nameUz: 'Klab Sendvich',
      description: 'Курица, бекон, яйцо, салат, томаты',
      price: 35000,
      categoryId: sandwiches.id,
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Куриный Ролл',
      nameUz: 'Tovuqli Roll',
      description: 'Куриное филе в тортилье с овощами',
      price: 24000,
      categoryId: sandwiches.id,
      sortOrder: 2,
    },
  })

  const fries = await prisma.product.create({
    data: {
      name: 'Картофель Фри',
      nameUz: 'Kartoshka Fri',
      description: 'Хрустящий золотистый картофель',
      price: 12000,
      categoryId: sides.id,
      sortOrder: 1,
    },
  })

  const nuggets = await prisma.product.create({
    data: {
      name: 'Наггетсы 6шт',
      nameUz: 'Naggets 6ta',
      description: 'Куриные наггетсы с соусом на выбор',
      price: 18000,
      categoryId: sides.id,
      sortOrder: 2,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Крылышки 8шт',
      nameUz: 'Qanotchalar 8ta',
      description: 'Куриные крылышки в хрустящей панировке',
      price: 28000,
      categoryId: sides.id,
      sortOrder: 3,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Луковые кольца',
      nameUz: "Piyoz halqalari",
      description: 'Хрустящие луковые кольца',
      price: 14000,
      categoryId: sides.id,
      sortOrder: 4,
    },
  })

  const cola = await prisma.product.create({
    data: {
      name: 'Кока-Кола',
      nameUz: 'Koka-Kola',
      description: 'Освежающий напиток',
      price: 8000,
      categoryId: drinks.id,
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Фанта',
      nameUz: 'Fanta',
      description: 'Апельсиновый вкус',
      price: 8000,
      categoryId: drinks.id,
      sortOrder: 2,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Спрайт',
      nameUz: 'Sprayt',
      description: 'Лимонно-лаймовый вкус',
      price: 8000,
      categoryId: drinks.id,
      sortOrder: 3,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Чай',
      nameUz: 'Choy',
      description: 'Чёрный или зелёный',
      price: 5000,
      categoryId: drinks.id,
      sortOrder: 4,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Кофе',
      nameUz: 'Qahva',
      description: 'Американо',
      price: 12000,
      categoryId: drinks.id,
      sortOrder: 5,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Мороженое',
      nameUz: 'Muzqaymoq',
      description: 'Ванильное мороженое с топпингом',
      price: 10000,
      categoryId: desserts.id,
      sortOrder: 1,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Яблочный пирог',
      nameUz: 'Olmali pirog',
      description: 'Горячий яблочный пирог',
      price: 8000,
      categoryId: desserts.id,
      sortOrder: 2,
    },
  })

  const combo1 = await prisma.product.create({
    data: {
      name: 'Комбо №1',
      nameUz: 'Kombo №1',
      description: 'Классик Бургер + Фри (М) + Кола (М)',
      price: 42000,
      categoryId: combo.id,
      sortOrder: 1,
    },
  })

  const combo2 = await prisma.product.create({
    data: {
      name: 'Комбо №2',
      nameUz: 'Kombo №2',
      description: 'Чизбургер + Фри (Б) + Кола (Б)',
      price: 52000,
      categoryId: combo.id,
      sortOrder: 2,
    },
  })

  await prisma.product.create({
    data: {
      name: 'Комбо Семейное',
      nameUz: 'Oilaviy Kombo',
      description: '2 Бургера + 2 Фри + Наггетсы + 2 Колы',
      price: 95000,
      categoryId: combo.id,
      sortOrder: 3,
    },
  })

  // Link products to modifier groups
  console.log('Linking products to modifiers...')
  const burgerProducts = [classicBurger, cheeseBurger, doubleBurger, chickenBurger, spicyBurger]
  for (const product of burgerProducts) {
    await prisma.productModifier.createMany({
      data: [
        { productId: product.id, modifierGroupId: sauces.id },
        { productId: product.id, modifierGroupId: extras.id },
      ],
    })
  }

  // ==================== SAMPLE ORDERS ====================
  console.log('Creating sample orders...')

  const paymentMethods = ['CASH', 'UZCARD', 'CLICK', 'PAYME', 'HUMO']
  const products = [classicBurger, cheeseBurger, doubleBurger, chickenBurger, fries, cola, nuggets, combo1, combo2]

  let orderNumber = 1000

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    date.setHours(10, 0, 0, 0)

    const ordersPerDay = Math.floor(Math.random() * 16) + 15

    for (let i = 0; i < ordersPerDay; i++) {
      orderNumber++
      const orderDate = new Date(date)
      orderDate.setHours(10 + Math.floor(Math.random() * 10))
      orderDate.setMinutes(Math.floor(Math.random() * 60))

      const itemCount = Math.floor(Math.random() * 4) + 1
      const orderItems: { productId: string; quantity: number; price: number; total: number }[] = []
      let subtotal = 0

      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 2) + 1
        const itemTotal = product.price * quantity
        subtotal += itemTotal

        orderItems.push({
          productId: product.id,
          quantity,
          price: product.price,
          total: itemTotal,
        })
      }

      const discount = Math.random() > 0.9 ? Math.floor(subtotal * 0.1) : 0
      const total = subtotal - discount

      const statuses = daysAgo === 0 ? ['NEW', 'PREPARING', 'READY', 'COMPLETED'] : ['COMPLETED']
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      await prisma.order.create({
        data: {
          orderNumber,
          branchId: [branch1.id, branch2.id, branch3.id][Math.floor(Math.random() * 3)],
          userId: [cashier1.id, cashier2.id][Math.floor(Math.random() * 2)],
          status,
          type: Math.random() > 0.3 ? 'DINE_IN' : 'TAKEAWAY',
          subtotal,
          discount,
          total,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
          createdAt: orderDate,
          updatedAt: orderDate,
          completedAt: status === 'COMPLETED' ? orderDate : null,
          items: {
            create: orderItems,
          },
        },
      })
    }
  }

  // Create active orders for today
  const activeOrders = [
    { status: 'NEW', number: orderNumber + 1 },
    { status: 'NEW', number: orderNumber + 2 },
    { status: 'PREPARING', number: orderNumber + 3 },
    { status: 'PREPARING', number: orderNumber + 4 },
    { status: 'READY', number: orderNumber + 5 },
  ]

  for (const activeOrder of activeOrders) {
    const items = [
      { product: classicBurger, qty: 1 },
      { product: fries, qty: 1 },
      { product: cola, qty: 1 },
    ]
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0)

    await prisma.order.create({
      data: {
        orderNumber: activeOrder.number,
        branchId: branch1.id,
        userId: cashier1.id,
        status: activeOrder.status,
        type: 'DINE_IN',
        subtotal,
        discount: 0,
        total: subtotal,
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        items: {
          create: items.map(item => ({
            productId: item.product.id,
            quantity: item.qty,
            price: item.product.price,
            total: item.product.price * item.qty,
          })),
        },
      },
    })
  }

  // ==================== INGREDIENTS & INVENTORY ====================
  console.log('Creating ingredients and inventory...')

  const beefPatty = await prisma.ingredient.create({
    data: { name: 'Говяжья котлета', nameUz: 'Mol go\'shti kotleti', unit: 'шт', minStock: 50 },
  })

  const chickenPatty = await prisma.ingredient.create({
    data: { name: 'Куриная котлета', nameUz: 'Tovuq kotleti', unit: 'шт', minStock: 50 },
  })

  const bun = await prisma.ingredient.create({
    data: { name: 'Булочка', nameUz: 'Bulochka', unit: 'шт', minStock: 100 },
  })

  const cheese = await prisma.ingredient.create({
    data: { name: 'Сыр', nameUz: 'Pishloq', unit: 'кг', minStock: 5 },
  })

  const potato = await prisma.ingredient.create({
    data: { name: 'Картофель', nameUz: 'Kartoshka', unit: 'кг', minStock: 50 },
  })

  const colaSyrup = await prisma.ingredient.create({
    data: { name: 'Сироп Кола', nameUz: 'Kola siropi', unit: 'л', minStock: 10 },
  })

  const ingredients = [beefPatty, chickenPatty, bun, cheese, potato, colaSyrup]
  const branches = [branch1, branch2, branch3]

  for (const branch of branches) {
    for (const ingredient of ingredients) {
      await prisma.inventoryItem.create({
        data: {
          ingredientId: ingredient.id,
          branchId: branch.id,
          quantity: Math.floor(Math.random() * 100) + 50,
        },
      })
    }
  }

  await prisma.productIngredient.createMany({
    data: [
      { productId: classicBurger.id, ingredientId: beefPatty.id, quantity: 1 },
      { productId: classicBurger.id, ingredientId: bun.id, quantity: 1 },
      { productId: cheeseBurger.id, ingredientId: beefPatty.id, quantity: 1 },
      { productId: cheeseBurger.id, ingredientId: bun.id, quantity: 1 },
      { productId: cheeseBurger.id, ingredientId: cheese.id, quantity: 0.05 },
      { productId: chickenBurger.id, ingredientId: chickenPatty.id, quantity: 1 },
      { productId: chickenBurger.id, ingredientId: bun.id, quantity: 1 },
      { productId: fries.id, ingredientId: potato.id, quantity: 0.15 },
      { productId: cola.id, ingredientId: colaSyrup.id, quantity: 0.03 },
    ],
  })

  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📊 Created:')
  console.log(`   - ${branches.length} branches`)
  console.log(`   - 6 users (admin, director, manager, 2 cashiers, cook)`)
  console.log(`   - 6 categories`)
  console.log(`   - 19 products`)
  console.log(`   - ~120+ orders (past 7 days)`)
  console.log(`   - ${ingredients.length} ingredients`)
  console.log('')
  console.log('🔐 Test credentials:')
  console.log('   Admin: admin@fastfood.uz / admin123')
  console.log('   Cashier: cashier1@fastfood.uz / cashier123 (PIN: 1234)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
