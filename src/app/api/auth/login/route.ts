import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function setAuthCookie(
  response: NextResponse,
  type: "admin" | "employee",
  userId: string
) {
  const cookieName = type === "admin" ? "admin_session" : "employee_session";
  const cookieValue = type === "admin" ? `aid:${userId}` : `eid:${userId}`;

  response.cookies.set({
    name: cookieName,
    value: cookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    // Try to find admin first
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (admin) {
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const res = NextResponse.json({
        ok: true,
        role: "admin",
        redirectTo: "/admin",
      });
      setAuthCookie(res, "admin", admin.id);
      return res;
    }

    // Try to find employee
    const employee = await prisma.employee.findUnique({
      where: { email },
    });
    if (employee) {
      const isValidPassword = await bcrypt.compare(password, employee.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }

      const res = NextResponse.json({
        ok: true,
        role: "employee",
        redirectTo: "/employee",
      });
      setAuthCookie(res, "employee", employee.id);
      return res;
    }

    // No user found
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
