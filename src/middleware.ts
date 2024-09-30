// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get cookies
  const username = req.cookies.get('username');
  const jobTitle = req.cookies.get('jobTitle');

  // If user details are not present, redirect to the blocking page
  if (!username || !jobTitle) {
    return NextResponse.redirect(new URL('/blocking', req.url));
  }

  // Allow the request to proceed if user details exist
  return NextResponse.next();
}

// Apply middleware to all routes except `/blocking`
export const config = {
  matcher: ['/', '/info'],
};
