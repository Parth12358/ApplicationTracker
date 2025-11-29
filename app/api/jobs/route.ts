import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jobs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Get username from cookie/session
    const username = request.cookies.get('username')?.value
    
    if (!username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all jobs for this user, ordered by newest first (latest applied)
    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.username, username))
      .orderBy(desc(jobs.createdAt))

    return NextResponse.json({ jobs: userJobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}