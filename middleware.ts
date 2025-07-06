import { createServerComponentClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerComponentClient();

  const { data: { session } } = await supabase.auth.getSession();

  console.log('Middleware - Current path:', req.nextUrl.pathname);
  console.log('Middleware - Session exists:', !!session);

  // If user is not signed in and the current path is an admin route
  if (!session && req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/auth')) {
    console.log('Middleware - Redirecting to auth');
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/auth';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and trying to access auth page
  if (session && req.nextUrl.pathname === '/admin/auth') {
    console.log('Middleware - Redirecting to admin dashboard');
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};