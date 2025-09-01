import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // ลบคุกกี้ admin_session
  response.cookies.set({
    name: "admin_session",
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}

