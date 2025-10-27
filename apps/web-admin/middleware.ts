import { withAuth } from 'next-auth/middleware'

export default withAuth()

export const config = {
  matcher: ['/companies/:path*', '/channels/:path*'],
}
