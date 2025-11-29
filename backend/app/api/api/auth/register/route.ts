import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, tenantName, shopifyDomain, shopifyAccessToken } = await req.json()

    // Validate input
    if (!email || !password || !tenantName || !shopifyDomain || !shopifyAccessToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Check if tenant exists
    let tenant = await prisma.tenant.findUnique({
      where: { shopifyDomain },
    })

    // Create tenant if doesn't exist
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: tenantName,
          shopifyDomain,
          shopifyAccessToken,
        },
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        tenantId: tenant.id,
        role: 'admin',
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
