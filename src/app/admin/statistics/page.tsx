"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Target,
} from "lucide-react";

interface WorkTicket {
  id: string;
  price: number;
  workerName: string;
  imageUrl?: string;
  description?: string;
  status: string;
  createdAt: string;
}

interface Statistics {
  totalTickets: number;
  totalRevenue: number;
  averagePrice: number;
  completedTickets: number;
  pendingTickets: number;
  cancelledTickets: number;
  topWorkers: { name: string; count: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  dailyStats: { date: string; tickets: number; revenue: number }[];
}

export default function StatisticsPage() {
  const [tickets, setTickets] = useState<WorkTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("all"); // all, week, month

  useEffect(() => {
    fetchTickets();
  }, []);

  const calculateStatistics = useCallback(() => {
    let filteredTickets = [...tickets];

    // Filter by period
    if (selectedPeriod === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filteredTickets = tickets.filter(
        (ticket) => new Date(ticket.createdAt) >= weekAgo
      );
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filteredTickets = tickets.filter(
        (ticket) => new Date(ticket.createdAt) >= monthAgo
      );
    }

    // Calculate basic stats
    const totalTickets = filteredTickets.length;
    const totalRevenue = filteredTickets.reduce(
      (sum, ticket) => sum + ticket.price,
      0
    );
    const averagePrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

    // Status counts
    const completedTickets = filteredTickets.filter(
      (t) => t.status === "completed"
    ).length;
    const pendingTickets = filteredTickets.filter(
      (t) => t.status === "pending"
    ).length;
    const cancelledTickets = filteredTickets.filter(
      (t) => t.status === "cancelled"
    ).length;

    // Top workers
    const workerStats = filteredTickets.reduce((acc, ticket) => {
      if (!acc[ticket.workerName]) {
        acc[ticket.workerName] = { count: 0, revenue: 0 };
      }
      acc[ticket.workerName].count++;
      acc[ticket.workerName].revenue += ticket.price;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const topWorkers = Object.entries(workerStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Monthly revenue
    const monthlyRevenue = filteredTickets.reduce((acc, ticket) => {
      const month = new Date(ticket.createdAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
      });
      acc[month] = (acc[month] || 0) + ticket.price;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRevenueArray = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );

    // Daily stats
    const dailyStats = filteredTickets.reduce((acc, ticket) => {
      const date = new Date(ticket.createdAt).toLocaleDateString("th-TH");
      if (!acc[date]) {
        acc[date] = { tickets: 0, revenue: 0 };
      }
      acc[date].tickets++;
      acc[date].revenue += ticket.price;
      return acc;
    }, {} as Record<string, { tickets: number; revenue: number }>);

    const dailyStatsArray = Object.entries(dailyStats)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    setStats({
      totalTickets,
      totalRevenue,
      averagePrice,
      completedTickets,
      pendingTickets,
      cancelledTickets,
      topWorkers,
      monthlyRevenue: monthlyRevenueArray,
      dailyStats: dailyStatsArray,
    });
  }, [tickets, selectedPeriod]);

  useEffect(() => {
    if (tickets.length > 0) {
      calculateStatistics();
    }
  }, [tickets, selectedPeriod, calculateStatistics]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/work-tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const getCompletionRate = () => {
    if (!stats) return 0;
    return stats.totalTickets > 0
      ? Math.round((stats.completedTickets / stats.totalTickets) * 100)
      : 0;
  };

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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">สถิติการทำงาน</h1>
        <p className="text-lg text-gray-600">
          ดูข้อมูลสรุปและสถิติการทำงานทั้งหมด
        </p>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">ช่วงเวลา</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPeriod("all")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              selectedPeriod === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              selectedPeriod === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            รายสัปดาห์
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              selectedPeriod === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            รายเดือน
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">งานทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalTickets || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายได้รวม</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                อัตราการเสร็จสิ้น
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getCompletionRate()}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ราคาเฉลี่ย</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats?.averagePrice || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">สถานะงาน</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">เสร็จแล้ว</span>
              </div>
              <span className="font-medium">
                {stats?.completedTickets || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">รอดำเนินการ</span>
              </div>
              <span className="font-medium">{stats?.pendingTickets || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-700">ยกเลิก</span>
              </div>
              <span className="font-medium">
                {stats?.cancelledTickets || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            ช่างยอดนิยม
          </h3>
          <div className="space-y-3">
            {stats?.topWorkers.map((worker, index) => (
              <div
                key={worker.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{worker.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{worker.count} งาน</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(worker.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            รายได้รายเดือน
          </h3>
          <div className="space-y-3">
            {stats.monthlyRevenue.map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between"
              >
                <span className="text-gray-700">{item.month}</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats?.dailyStats && stats.dailyStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            กิจกรรมล่าสุด (7 วัน)
          </h3>
          <div className="space-y-3">
            {stats.dailyStats.map((item) => (
              <div
                key={item.date}
                className="flex items-center justify-between"
              >
                <span className="text-gray-700">{item.date}</span>
                <div className="text-right">
                  <div className="font-medium">{item.tickets} งาน</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
