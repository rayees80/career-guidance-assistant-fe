import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const sessionid = request.cookies.get('sessionid')?.value;
  console.log(sessionid);
  
  // If session exists redirect to /[locale]/chatbot
  
  // Otherwise use next-intl middleware
  return createMiddleware({
    locales: ['en', 'ar'],
    defaultLocale: 'en'
  })(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};