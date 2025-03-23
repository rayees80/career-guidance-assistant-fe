import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const sessionid = request.cookies.get('sessionid')?.value;
  
  // Only redirect if we're not already on the chatbot page
  if (sessionid && !request.nextUrl.pathname.includes('/chatbot')) {
    // Get the locale from the URL or use the default
    const locale = request.nextUrl.locale || 'en';
    
    // Create the new URL properly
    const url = new URL(request.url);
    url.pathname = `/${locale}/chatbot`;
    
    return NextResponse.redirect(url);
  }
  
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