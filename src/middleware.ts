import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware running for:", pathname);

  // Check if the request is for admin routes (excluding login and API routes)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/api/")
  ) {
    console.log("🔒 Checking admin route:", pathname);

    // Check for admin session cookie
    const adminSession = request.cookies.get("admin_session");
    console.log("🍪 Admin session cookie:", adminSession);

    if (!adminSession || !adminSession.value.startsWith("aid:")) {
      console.log("❌ No valid session, redirecting to login");
      // Redirect to login page with the original URL as a parameter
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("✅ Valid session found");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
