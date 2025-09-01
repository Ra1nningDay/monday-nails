"use client";

import { useEffect, useState } from "react";
import { User, LogOut, FileText, Menu, X } from "lucide-react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get employee info from session/cookie if needed
    setUser("Employee"); // Placeholder, you can implement proper user fetch
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  Monday Nail - Employee
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {user}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a
                href="/employee"
                className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                รายงานการทำงาน
              </a>
              <div className="border-t pt-2">
                <div className="flex items-center px-3 py-2">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">{user}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
