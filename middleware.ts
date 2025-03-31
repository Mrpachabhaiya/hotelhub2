import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const authRoutes = ['/login', '/register'];
  
  // Only check valid tokens
  if (token) {
    try {
      // Verify token before redirecting
      const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: {
          'Cookie': `token=${token}`
        }
      });
      
      if (verifyResponse.ok && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // If token verification fails, clear the invalid token
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
}