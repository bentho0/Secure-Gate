import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Resolve Auth Token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isEmailVerified = token?.emailVerified ? true : false;

  // Define route categories
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isVerifyEmailRoute = pathname.startsWith("/verify-email");

  // Response instance we will configure
  let response = NextResponse.next();

  // 2. Perform Routing Protection
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Redirect unauthenticated user to login
      response = NextResponse.redirect(new URL("/auth?mode=login", request.url));
      return addSecurityHeaders(response);
    }

    if (!isEmailVerified) {
      // Redirect authenticated but unverified user to verification info page
      response = NextResponse.redirect(new URL("/verify-email", request.url));
      return addSecurityHeaders(response);
    }
  }

  if (isVerifyEmailRoute) {
    // If they land on verify-email but are already verified, redirect them to dashboard
    if (isAuthenticated && isEmailVerified && pathname === "/verify-email") {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
      return addSecurityHeaders(response);
    }
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      // Redirect logged-in users away from auth pages
      response = NextResponse.redirect(new URL("/dashboard", request.url));
      return addSecurityHeaders(response);
    }
  }

  return addSecurityHeaders(response);
}

// Security Headers Helper
function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  
  // Custom Content-Security-Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';"
  );

  return response;
}

// Middleware Matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
