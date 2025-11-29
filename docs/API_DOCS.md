# Xeno Shopify Insights - API Documentation

## Overview

This document provides detailed information about the REST API endpoints available in the Xeno Shopify Insights Platform.

## Base URL

```
Production: https://your-domain.com
Development: http://localhost:3000
```

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Webhook endpoints use HMAC verification.

### Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/signin` (handled by NextAuth)
3. **Session**: Maintained via HTTP-only cookies

---

## Endpoints

### Authentication

#### Register New Tenant

**Endpoint**: `POST /api/auth/register`

**Description**: Creates a new tenant account and user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "tenantName": "My Shopify Store",
  "shopifyDomain": "mystore.myshopify.com",
  "shopifyAccessToken": "shpat_xxxxxxxxxxxxx"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "clu123abc",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
- `400 Bad Request`: User already exists
- `500 Internal Server Error`: Server error

---

#### Login

**Endpoint**: `POST /api/auth/signin`

**Description**: Authenticates user (handled by NextAuth).

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response**: Session cookie set, redirects to dashboard

---

### Webhooks

All webhook endpoints require:
- `x-shopify-hmac-sha256` header for verification
- `x-shopify-shop-domain` header to identify tenant

#### Customer Webhook

**Endpoint**: `POST /api/webhooks/customers`

**Description**: Receives customer create/update events from Shopify.

**Headers**:
```
x-shopify-hmac-sha256: base64-encoded-signature
x-shopify-shop-domain: mystore.myshopify.com
Content-Type: application/json
```

**Request Body** (Shopify Customer Object):
```json
{
  "id": 123456789,
  "email": "customer@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1234567890",
  "orders_count": 5,
  "total_spent": "299.95",
  "state": "enabled",
  "tags": "VIP, Newsletter",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

**Error Responses**:
- `400 Bad Request`: Missing headers
- `401 Unauthorized`: Invalid HMAC signature
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Processing error

---

#### Order Webhook

**Endpoint**: `POST /api/webhooks/orders`

**Description**: Receives order create/update events from Shopify.

**Request Body** (Shopify Order Object):
```json
{
  "id": 987654321,
  "order_number": 1001,
  "email": "customer@example.com",
  "customer": {
    "id": 123456789,
    "email": "customer@example.com",
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "total_price": "149.99",
  "subtotal_price": "139.99",
  "total_tax": "10.00",
  "currency": "USD",
  "financial_status": "paid",
  "fulfillment_status": "fulfilled",
  "billing_address": {},
  "shipping_address": {},
  "line_items": [
    {
      "id": 111,
      "product_id": 222,
      "variant_id": 333,
      "title": "Cool Product",
      "quantity": 2,
      "price": "69.99"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

---

#### Product Webhook

**Endpoint**: `POST /api/webhooks/products`

**Description**: Receives product create/update events from Shopify.

**Request Body** (Shopify Product Object):
```json
{
  "id": 555666777,
  "title": "Awesome Product",
  "vendor": "My Brand",
  "product_type": "Electronics",
  "status": "active",
  "tags": "featured, sale",
  "handle": "awesome-product",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-20T12:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

---

#### Cart Abandoned Webhook

**Endpoint**: `POST /api/webhooks/carts/abandoned`

**Description**: Receives cart abandonment events from Shopify.

**Request Body**:
```json
{
  "id": "abc123def456",
  "email": "customer@example.com",
  "customer": {
    "id": 123456789
  },
  "abandoned_checkout_url": "https://mystore.com/checkout/abc123",
  "line_items": [],
  "created_at": "2024-01-20T15:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

---

### Analytics

#### Get Dashboard Analytics

**Endpoint**: `GET /api/analytics`

**Description**: Retrieves aggregated analytics data for the authenticated user's tenant.

**Authentication**: Required (Session cookie)

**Query Parameters**:
- `startDate` (optional): ISO date string (e.g., `2024-01-01`)
- `endDate` (optional): ISO date string (e.g., `2024-01-31`)

**Example Request**:
```
GET /api/analytics?startDate=2024-01-01&endDate=2024-01-31
```

**Response** (200 OK):
```json
{
  "summary": {
    "totalCustomers": 1250,
    "totalOrders": 3420,
    "totalRevenue": 125430.50,
    "avgOrderValue": 36.67
  },
  "topCustomers": [
    {
      "id": "clu123",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "totalSpent": 2499.99,
      "ordersCount": 15
    }
  ],
  "ordersByDate": [
    {
      "date": "2024-01-20",
      "count": 45,
      "revenue": 1599.95
    }
  ],
  "revenueTrend": [
    {
      "date": "2024-01-14",
      "revenue": 1250.00
    }
  ],
  "customerGrowth": [
    {
      "date": "2024-01-15",
      "count": 12
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

### Data Synchronization

#### Trigger Manual Sync

**Endpoint**: `POST /api/sync/manual`

**Description**: Manually triggers a full data sync from Shopify for the authenticated user's tenant.

**Authentication**: Required (Session cookie)

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Manual sync completed"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Sync failed

---

#### Scheduled Sync (Cron)

**Endpoint**: `POST /api/sync`

**Description**: Syncs all active tenants. Intended for scheduled cron jobs.

**Authentication**: Bearer token required

**Headers**:
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Sync completed"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Sync failed

---

#### Manual Sync (Development Only)

**Endpoint**: `GET /api/sync`

**Description**: Triggers sync manually (only works in development mode).

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Sync completed"
}
```

**Error Responses**:
- `403 Forbidden`: Not in development mode
- `500 Internal Server Error`: Sync failed

---

## Data Models

### Customer Object

```typescript
{
  id: string
  shopifyCustomerId: string
  tenantId: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  ordersCount: number
  totalSpent: Decimal
  state: string | null
  tags: string | null
  createdAt: Date
  updatedAt: Date
  shopifyCreatedAt: Date | null
  shopifyUpdatedAt: Date | null
}
```

### Order Object

```typescript
{
  id: string
  shopifyOrderId: string
  tenantId: string
  customerId: string | null
  orderNumber: number | null
  email: string | null
  totalPrice: Decimal
  subtotalPrice: Decimal | null
  totalTax: Decimal | null
  currency: string
  financialStatus: string | null
  fulfillmentStatus: string | null
  billingAddress: Json | null
  shippingAddress: Json | null
  createdAt: Date
  updatedAt: Date
  shopifyCreatedAt: Date | null
  shopifyUpdatedAt: Date | null
  items: OrderItem[]
}
```

### Product Object

```typescript
{
  id: string
  shopifyProductId: string
  tenantId: string
  title: string
  vendor: string | null
  productType: string | null
  status: string | null
  tags: string | null
  handle: string | null
  createdAt: Date
  updatedAt: Date
  shopifyCreatedAt: Date | null
  shopifyUpdatedAt: Date | null
}
```

---

## Error Handling

All API endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production:

**Recommended Limits**:
- Webhooks: No limit (verified by HMAC)
- Analytics API: 100 requests per minute per tenant
- Sync API: 1 request per 5 minutes per tenant

---

## Webhook Verification

All webhook endpoints verify the HMAC signature to ensure authenticity.

**Verification Process**:
1. Extract `x-shopify-hmac-sha256` header
2. Compute HMAC-SHA256 of raw request body using `SHOPIFY_WEBHOOK_SECRET`
3. Encode result as base64
4. Compare with header value
5. If match: proceed; if not: return 401

**Example** (Node.js):
```javascript
const crypto = require('crypto')

function verifyWebhook(rawBody, hmacHeader, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64')
  
  return hash === hmacHeader
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "tenantName": "Test Store",
    "shopifyDomain": "teststore.myshopify.com",
    "shopifyAccessToken": "shpat_test123"
  }'
```

### Get Analytics
```bash
curl http://localhost:3000/api/analytics?startDate=2024-01-01&endDate=2024-01-31 \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Trigger Manual Sync
```bash
curl -X POST http://localhost:3000/api/sync/manual \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Cron Sync
```bash
curl -X POST https://your-domain.com/api/sync \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Shopify API Integration

### Admin API Version

This application uses Shopify Admin API `2024-01`.

### Required Scopes

- `read_customers`
- `read_orders`
- `read_products`
- `read_inventory`

### Pagination

The sync service handles pagination automatically using Shopify's link header:
- Default limit: 250 items per page
- Follows `rel="next"` links until all data is fetched

---

## Best Practices

1. **Webhook Retry**: Shopify retries failed webhooks. Ensure idempotent processing.
2. **Database Upserts**: Use upsert operations to handle duplicate events.
3. **Error Logging**: Log all errors for debugging.
4. **Monitoring**: Track webhook processing times and failure rates.
5. **Security**: Always verify HMAC signatures on webhooks.

---

## Support

For issues or questions:
- GitHub Issues: [your-repo/issues]
- Email: [your-email@example.com]
