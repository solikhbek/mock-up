# FastFood POS System - MVP

Система управления фаст-фуд рестораном для Узбекистана.

## Модули

| Модуль | URL | Описание |
|--------|-----|----------|
| Главная | `/` | Навигация по всем модулям |
| POS Касса | `/pos` | Приём заказов и оплата |
| KDS Кухня | `/kds` | Экран повара с заказами |
| CDS Клиент | `/cds` | Табло готовности заказов |
| Дашборд | `/dashboard` | Аналитика и отчёты |
| Меню | `/menu` | Управление блюдами |

## Технологии

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite (Prisma ORM)
- **Charts:** Recharts
- **Icons:** Lucide React

## Быстрый старт

### 1. Установка зависимостей
```bash
cd fastfood-pos
npm install
```

### 2. Настройка базы данных
```bash
# Генерация Prisma Client
npx prisma generate

# Создание таблиц
npx prisma db push

# Заполнение тестовыми данными
npx tsx prisma/seed.ts
```

### 3. Запуск
```bash
npm run dev
```

Откройте http://localhost:3000

## Тестовые данные

После запуска seed в базе будут:
- **3 филиала** (Central, Yunusabad, Sergeli)
- **6 пользователей** (админ, директор, менеджер, 2 кассира, повар)
- **6 категорий** (Комбо, Бургеры, Сэндвичи, Гарниры, Напитки, Десерты)
- **19 блюд** с ценами в сумах
- **~120+ заказов** за последние 7 дней
- **5 активных заказов** для демо KDS/CDS

### Тестовые учётные данные
- **Admin:** admin@fastfood.uz / admin123
- **Cashier:** cashier1@fastfood.uz / cashier123 (PIN: 1234)

## Способы оплаты

- Наличные
- Uzcard / Humo
- Click
- Payme
- Uzum Bank
- Visa / Mastercard

## Структура проекта

```
fastfood-pos/
├── prisma/
│   ├── schema.prisma    # Схема БД
│   ├── seed.ts          # Тестовые данные
│   └── dev.db           # SQLite база
├── src/
│   ├── app/
│   │   ├── page.tsx           # Главная
│   │   ├── pos/page.tsx       # Касса
│   │   ├── kds/page.tsx       # Экран кухни
│   │   ├── cds/page.tsx       # Экран клиента
│   │   ├── dashboard/page.tsx # Дашборд
│   │   ├── menu/page.tsx      # Управление меню
│   │   └── api/               # API endpoints
│   ├── lib/
│   │   └── prisma.ts          # Prisma client
│   └── components/            # UI компоненты
└── package.json
```

## API Endpoints

| Endpoint | Методы | Описание |
|----------|--------|----------|
| `/api/categories` | GET, POST | Категории меню |
| `/api/products` | GET, POST | Блюда |
| `/api/orders` | GET, POST | Заказы |
| `/api/orders/[id]` | GET, PATCH, DELETE | Управление заказом |
| `/api/stats` | GET | Статистика и аналитика |

## Скриншоты демо

### Главная страница
- Навигация по всем модулям
- Быстрая статистика
- Поддерживаемые способы оплаты

### POS Касса
- Выбор блюд по категориям
- Корзина с редактированием
- Выбор способа оплаты
- Переключение Зал/С собой

### KDS Экран кухни
- Заказы с цветовой индикацией времени
- Статусы: Новый → Готовится → Готов
- Звуковые уведомления
- Авто-обновление каждые 5 сек

### CDS Экран клиента
- Номера заказов крупным шрифтом
- Готовится / Готов
- Звуковое и голосовое уведомление
- Рекламный баннер

### Дашборд
- Выручка и заказы
- Графики за 7 дней
- Топ продаж
- Сравнение филиалов
- Способы оплаты (pie chart)

---

**FastFood POS MVP** | Project Manager Case Study | 2025
