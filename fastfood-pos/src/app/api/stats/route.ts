import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today'

    let startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    // Total orders and revenue
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      select: {
        total: true,
        createdAt: true,
        branchId: true,
        paymentMethod: true
      }
    })

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const averageCheck = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Active orders count (for today)
    const activeOrders = await prisma.order.count({
      where: {
        status: { in: ['NEW', 'PREPARING', 'READY'] }
      }
    })

    // Revenue by payment method
    const revenueByPayment = orders.reduce((acc, order) => {
      const method = order.paymentMethod || 'UNKNOWN'
      acc[method] = (acc[method] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

    // Revenue by day (last 7 days)
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= date && orderDate < nextDate
      })

      last7Days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0)
      })
    }

    // Top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: {
        quantity: true,
        total: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    })

    // Get product details
    const productIds = topProducts.map(p => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true }
    })

    const topProductsWithDetails = topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId)
      return {
        id: tp.productId,
        name: product?.name || 'Unknown',
        price: product?.price || 0,
        quantity: tp._sum.quantity || 0,
        revenue: tp._sum.total || 0
      }
    })

    // Orders by branch
    const branches = await prisma.branch.findMany({
      select: { id: true, name: true }
    })

    const ordersByBranch = branches.map(branch => {
      const branchOrders = orders.filter(o => o.branchId === branch.id)
      return {
        id: branch.id,
        name: branch.name,
        orders: branchOrders.length,
        revenue: branchOrders.reduce((sum, o) => sum + o.total, 0)
      }
    })

    // Hourly distribution (today only)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart)

    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourOrders = todayOrders.filter(o => {
        const orderHour = new Date(o.createdAt).getHours()
        return orderHour === hour
      })
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        orders: hourOrders.length,
        revenue: hourOrders.reduce((sum, o) => sum + o.total, 0)
      }
    }).filter(h => h.hour >= '08:00' && h.hour <= '22:00')

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        averageCheck,
        activeOrders
      },
      revenueByPayment,
      last7Days,
      topProducts: topProductsWithDetails,
      ordersByBranch,
      hourlyData
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
