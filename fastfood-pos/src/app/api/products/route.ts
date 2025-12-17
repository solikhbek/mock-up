import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId } : {})
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: true,
        modifiers: {
          include: {
            modifierGroup: {
              include: {
                modifiers: true
              }
            }
          }
        }
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        nameUz: body.nameUz,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        image: body.image,
        sortOrder: body.sortOrder || 0,
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
