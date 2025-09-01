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
      console.log("❌ No valid admin session, redirecting to login");
      // Redirect to login page with the original URL as a parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("✅ Valid admin session found");
    }
  }

  // Check if the request is for employee routes
  if (pathname.startsWith("/employee") && !pathname.startsWith("/api/")) {
    console.log("🔒 Checking employee route:", pathname);

    // Check for employee session cookie
    const employeeSession = request.cookies.get("employee_session");
    console.log("🍪 Employee session cookie:", employeeSession);

    if (!employeeSession || !employeeSession.value.startsWith("eid:")) {
      console.log("❌ No valid employee session, redirecting to login");
      // Redirect to login page with the original URL as a parameter
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log("✅ Valid employee session found");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/employee", "/employee/:path*"],
};
