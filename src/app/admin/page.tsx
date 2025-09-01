"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  BarChart3,
  Users,
  DollarSign,
  Home,
  Activity,
  Target,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface WorkTicket {
  id: string;
  price: number;
  workerName: string;
  imageUrl?: string;
  description?: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalTickets: number;
  todayRevenue: number;
  activeWorkers: number;
  completedTickets: number;
  recentActivities: {
    id: string;
    workerName: string;
    price: number;
    status: string;
    createdAt: string;
    description?: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/work-tickets");
      if (response.ok) {
        const tickets: WorkTicket[] = await response.json();
        calculateDashboardStats(tickets);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateDashboardStats = (tickets: WorkTicket[]) => {
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter tickets for today
    const todayTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt);
      ticketDate.setHours(0, 0, 0, 0);
      return ticketDate.getTime() === today.getTime();
    });

    // Calculate stats
    const totalTickets = tickets.length;
    const todayRevenue = todayTickets.reduce(
      (sum, ticket) => sum + ticket.price,
      0
    );
    const completedTickets = tickets.filter(
      (t) => t.status === "completed"
    ).length;

    // Get unique workers
    const uniqueWorkers = new Set(tickets.map((t) => t.workerName));
    const activeWorkers = uniqueWorkers.size;

    // Get recent activities (last 5 tickets)
    const recentActivities = tickets
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((ticket) => ({
        id: ticket.id,
        workerName: ticket.workerName,
        price: ticket.price,
        status: ticket.status,
        createdAt: ticket.createdAt,
        description: ticket.description,
      }));

    setStats({
      totalTickets,
      todayRevenue,
      activeWorkers,
      completedTickets,
      recentActivities,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "ไม่กี่นาทีที่แล้ว";
    } else if (diffInHours < 24) {
      return `${diffInHours} ชั่วโมงที่แล้ว`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} วันที่แล้ว`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "เสร็จแล้ว";
      case "pending":
        return "รอดำเนินการ";
      case "cancelled":
        return "ยกเลิก";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  // Chart data preparation - รายได้รายวันจาก activities ล่าสุด
  const revenueChartData = stats?.recentActivities
    ? (() => {
        // จัดกลุ่มข้อมูลตามวันที่
        const dailyRevenue: Record<string, number> = {};

        stats.recentActivities.forEach((activity) => {
          const date = new Date(activity.createdAt);
          const dateKey = date.toLocaleDateString("th-TH", {
            month: "short",
            day: "numeric",
          });

          dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + activity.price;
        });

        // แปลงเป็น array และเรียงตามวันที่
        return Object.entries(dailyRevenue)
          .map(([date, revenue]) => ({
            วันที่: date,
            รายได้: revenue,
          }))
          .sort((a, b) => {
            // เรียงตามวันที่ (ใหม่ไปเก่า)
            return new Date(b.วันที่).getTime() - new Date(a.วันที่).getTime();
          })
          .slice(0, 7) // เอาแค่ 7 วันล่าสุด
          .reverse(); // กลับให้เก่าไปใหม่สำหรับกราฟ
      })()
    : [];

  const statusChartData = [
    {
      name: "เสร็จแล้ว",
      value:
        stats?.recentActivities?.filter((a) => a.status === "completed")
          .length || 0,
      color: "#10b981",
    },
    {
      name: "รอดำเนินการ",
      value:
        stats?.recentActivities?.filter((a) => a.status === "pending").length ||
        0,
      color: "#f59e0b",
    },
    {
      name: "ยกเลิก",
      value:
        stats?.recentActivities?.filter((a) => a.status === "cancelled")
          .length || 0,
      color: "#ef4444",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ยินดีต้อนรับสู่ Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          จัดการระบบร้านทำเล็บ Monday Nail
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายงานทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalTickets || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายได้วันนี้</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.todayRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ช่างที่ทำงาน</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeWorkers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">งานเสร็จแล้ว</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedTickets || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            การดำเนินการด่วน
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/work-tickets"
            className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-blue-50 hover:to-blue-100"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                  ดูรายงานการทำงาน
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  จัดการและติดตามงานทั้งหมด
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/work-report"
            className="group p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-green-50 hover:to-green-100"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">
                  ส่งรายงานงานใหม่
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  สำหรับพนักงานส่งงาน
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/statistics"
            className="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-r hover:from-purple-50 hover:to-purple-100"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">
                  ดูสถิติ
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  วิเคราะห์ข้อมูลและรายได้
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              กิจกรรมล่าสุด
            </h2>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 ${getStatusColor(
                        activity.status
                      )} rounded-full shadow-sm`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.description || `งานของ ${activity.workerName}`}{" "}
                      - {activity.workerName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ราคา {formatCurrency(activity.price)} -{" "}
                      {getStatusText(activity.status)} -{" "}
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">ยังไม่มีกิจกรรมล่าสุด</p>
                <p className="text-sm">
                  เริ่มสร้างรายงานงานใหม่เพื่อดูกิจกรรมที่นี่
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              แนวโน้มรายได้
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="วันที่" />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "รายได้",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="รายได้"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              สถานะงานล่าสุด
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} งาน`, "จำนวน"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {statusChartData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
