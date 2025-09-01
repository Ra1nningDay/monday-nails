import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // ตรวจสอบ cookies
    const adminSession = req.cookies.get("admin_session");
    const employeeSession = req.cookies.get("employee_session");

    // ตรวจสอบ admin session
    if (adminSession && adminSession.value.startsWith("aid:")) {
      return NextResponse.json({
        authenticated: true,
        role: "admin",
        userId: adminSession.value.replace("aid:", ""),
      });
    }

    // ตรวจสอบ employee session
    if (employeeSession && employeeSession.value.startsWith("eid:")) {
      return NextResponse.json({
        authenticated: true,
        role: "employee",
        userId: employeeSession.value.replace("eid:", ""),
      });
    }

    // ไม่มี session ที่ถูกต้อง
    return NextResponse.json({
      authenticated: false,
      role: null,
      userId: null,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        role: null,
        userId: null,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
