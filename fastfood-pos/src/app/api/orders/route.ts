import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const branchId = searchParams.get('branchId')
    const limit = searchParams.get('limit')

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(branchId ? { branchId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        items: {
          include: {
            product: true,
            modifiers: {
              include: {
                modifier: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        },
        branch: {
          select: {
            name: true
          }
        }
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get the last order number
    const lastOrder = await prisma.order.findFirst({
      orderBy: { orderNumber: 'desc' }
    })
    const orderNumber = (lastOrder?.orderNumber || 1000) + 1

    // Calculate totals
    let subtotal = 0
    const itemsData = body.items.map((item: any) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
        note: item.note,
      }
    })

    const discount = body.discount || 0
    const total = subtotal - discount

    const order = await prisma.order.create({
      data: {
        orderNumber,
        branchId: body.branchId,
        userId: body.userId,
        type: body.type || 'DINE_IN',
        subtotal,
        discount,
        total,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus || 'PAID',
        note: body.note,
        items: {
          create: itemsData
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
