"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบการ authentication ปัจจุบัน
    const checkAuthStatus = async () => {
      try {
        // ตรวจสอบว่า user login อยู่แล้วหรือไม่
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const { authenticated, role } = await response.json();
          if (authenticated) {
            // ถ้า login แล้วให้ redirect ไปหน้าที่เหมาะสม
            const redirectTo = role === "admin" ? "/admin" : "/employee";
            console.log(
              `🔄 Already authenticated as ${role}, redirecting to ${redirectTo}`
            );
            router.replace(redirectTo);
            return;
          }
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        // ถ้าเกิดข้อผิดพลาด ให้แสดงหน้า login ปกติ
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthStatus();

    // ตรวจสอบว่ามี from parameter หรือไม่
    const from = searchParams.get("from");
    if (from) {
      setShowRedirectMessage(true);
    }
  }, [searchParams, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data && data.message) || "Login failed");
      }

      const { redirectTo } = await res.json();

      // ตรวจสอบว่ามีหน้าที่ต้องการกลับไปหรือไม่
      const from = searchParams.get("from");
      const finalRedirectTo =
        from && (from.startsWith("/admin") || from.startsWith("/employee"))
          ? from
          : redirectTo;

      console.log(`🔄 Login successful, redirecting to: ${finalRedirectTo}`);

      // Redirect based on role
      window.location.href = finalRedirectTo;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // แสดง loading ขณะกำลังตรวจสอบ authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Monday Nail</h1>
          <p className="text-gray-600 mt-2">เข้าสู่ระบบ</p>
        </div>

        {/* Redirect Message */}
        {showRedirectMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ⚠️ กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้าดังกล่าว
            </p>
          </div>
        )}

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
