import { prisma } from './lib/prisma'
import * as bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample tenant
  const tenant = await prisma.tenant.upsert({
    where: { shopifyDomain: 'demo-store.myshopify.com' },
    update: {},
    create: {
      name: 'Demo Store',
      shopifyDomain: 'demo-store.myshopify.com',
      shopifyAccessToken: 'demo-access-token',
    },
  })

  console.log('✅ Created tenant:', tenant.name)

  // Create sample user
  const hashedPassword = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      tenantId: tenant.id,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { 
        tenantId_shopifyCustomerId: { 
          tenantId: tenant.id, 
          shopifyCustomerId: 'cust_001' 
        } 
      },
      update: {},
      create: {
        tenantId: tenant.id,
        shopifyCustomerId: 'cust_001',
        email: 'customer1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        totalSpent: 1250.50,
        ordersCount: 5,
        tags: ['VIP', 'Newsletter'],
      },
    }),
    prisma.customer.upsert({
      where: { 
        tenantId_shopifyCustomerId: { 
          tenantId: tenant.id, 
          shopifyCustomerId: 'cust_002' 
        } 
      },
      update: {},
      create: {
        tenantId: tenant.id,
        shopifyCustomerId: 'cust_002',
        email: 'customer2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        totalSpent: 890.25,
        ordersCount: 3,
        tags: ['Wholesale'],
      },
    }),
  ])

  console.log('✅ Created', customers.length, 'customers')

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { 
        tenantId_shopifyProductId: { 
          tenantId: tenant.id, 
          shopifyProductId: 'prod_001' 
        } 
      },
      update: {},
      create: {
        tenantId: tenant.id,
        shopifyProductId: 'prod_001',
        title: 'Premium T-Shirt',
        vendor: 'Xeno Apparel',
        productType: 'Clothing',
        status: 'ACTIVE',
        tags: ['bestseller', 'summer'],
      },
    }),
    prisma.product.upsert({
      where: { 
        tenantId_shopifyProductId: { 
          tenantId: tenant.id, 
          shopifyProductId: 'prod_002' 
        } 
      },
      update: {},
      create: {
        tenantId: tenant.id,
        shopifyProductId: 'prod_002',
        title: 'Wireless Headphones',
        vendor: 'Xeno Electronics',
        productType: 'Electronics',
        status: 'ACTIVE',
        tags: ['featured', 'tech'],
      },
    }),
  ])

  console.log('✅ Created', products.length, 'products')

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        tenantId: tenant.id,
        shopifyOrderId: 'order_001',
        orderNumber: 1001,
        customerId: customers[0].id,
        email: customers[0].email,
        financialStatus: 'PAID',
        fulfillmentStatus: 'FULFILLED',
        totalPrice: 299.99,
        subtotalPrice: 249.99,
        totalTax: 50.00,
        currency: 'USD',
        shopifyCreatedAt: new Date('2024-01-15'),
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          province: 'NY',
          country: 'USA',
          zip: '10001',
        },
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          province: 'NY',
          country: 'USA',
          zip: '10001',
        },
        items: {
          create: [
            {
              tenantId: tenant.id,
              shopifyLineItemId: 'item_001',
              productId: products[0].id,
              title: products[0].title,
              quantity: 2,
              price: 124.995,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        tenantId: tenant.id,
        shopifyOrderId: 'order_002',
        orderNumber: 1002,
        customerId: customers[1].id,
        email: customers[1].email,
        financialStatus: 'PAID',
        fulfillmentStatus: 'FULFILLED',
        totalPrice: 450.00,
        subtotalPrice: 400.00,
        totalTax: 50.00,
        currency: 'USD',
        shopifyCreatedAt: new Date('2024-02-20'),
        billingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          address1: '456 Oak Ave',
          city: 'Los Angeles',
          province: 'CA',
          country: 'USA',
          zip: '90001',
        },
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          address1: '456 Oak Ave',
          city: 'Los Angeles',
          province: 'CA',
          country: 'USA',
          zip: '90001',
        },
        items: {
          create: [
            {
              tenantId: tenant.id,
              shopifyLineItemId: 'item_002',
              productId: products[1].id,
              title: products[1].title,
              quantity: 1,
              price: 400.00,
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created', orders.length, 'orders')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
