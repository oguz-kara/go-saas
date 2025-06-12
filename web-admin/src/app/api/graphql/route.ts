import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  const body = await req.text()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const accessToken = token?.accessToken as string | undefined

  const filteredHeaders = new Headers()
  filteredHeaders.set('Content-Type', 'application/json')

  if (accessToken) {
    filteredHeaders.set('Authorization', `Bearer ${accessToken}`)
  }

  const coreApiUrl =
    process.env.NEXT_PUBLIC_ADMIN_GRAPHQL_API_URL ||
    'http://localhost:3001/admin-api'

  try {
    const response = await fetch(coreApiUrl, {
      method: 'POST',
      headers: filteredHeaders,
      body,
      cache: 'no-store',
    })

    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    })

    return nextResponse
  } catch (error) {
    console.error('GraphQL Proxy Error:', error)
    return NextResponse.json(
      { message: 'Error proxying GraphQL request.' },
      { status: 500 },
    )
  }
}
