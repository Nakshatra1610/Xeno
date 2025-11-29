import { NextRequest, NextResponse } from 'next/server'
import { syncAllTenants } from '@/lib/shopify-sync'

export async function POST(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await syncAllTenants()

    return NextResponse.json({ success: true, message: 'Sync completed' })
  } catch (error) {
    console.error('Cron sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

// Also allow GET for manual triggering in development
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    await syncAllTenants()
    return NextResponse.json({ success: true, message: 'Sync completed' })
  } catch (error) {
    console.error('Manual sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
