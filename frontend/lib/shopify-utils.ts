import crypto from 'crypto'

export function verifyShopifyWebhook(
  rawBody: string,
  hmacHeader: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64')

  return hash === hmacHeader
}

export function extractTenantFromShopDomain(shopDomain: string): string {
  // Extract tenant identifier from Shopify domain
  return shopDomain.replace('.myshopify.com', '')
}
