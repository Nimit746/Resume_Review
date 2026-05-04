import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/editor', '/ats-checker', '/cover-letter', '/qa'];
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if trying to access auth pages with token
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*', '/ats-checker/:path*', '/cover-letter/:path*', '/qa/:path*', '/auth/:path*'],
};
