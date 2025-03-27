import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Pages to protect from logged-in users
  const authRoutes = ['/login', '/register'];
  
  // If user is logged in and tries to access auth routes
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home
  }

  return NextResponse.next();
}

// Match all auth routes
export const config = {
  matcher: ['/login', '/register'],
}