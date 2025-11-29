export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/api/analytics/:path*', '/api/sync/manual/:path*'],
}
