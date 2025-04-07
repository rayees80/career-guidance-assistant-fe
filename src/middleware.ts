import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/chatbot"];
const publicRoutes = ["/service", "/q1", "/", "/q2", "/service/*"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const sessionid = req.cookies.get("sessionid")?.value;

  if (isProtectedRoute && !sessionid) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    isPublicRoute &&
    sessionid &&
    !req.nextUrl.pathname.startsWith("/chatbot")
  ) {
    return NextResponse.redirect(new URL("/chatbot", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
