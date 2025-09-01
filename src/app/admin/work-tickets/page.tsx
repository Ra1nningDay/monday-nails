"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FileText,
  Filter,
  User,
  DollarSign,
  Clock,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
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

export default function WorkTicketsPage() {
  const [tickets, setTickets] = useState<WorkTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTickets, setFilteredTickets] = useState<WorkTicket[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchTickets();
  }, []);

  const filterTickets = useCallback(() => {
    let filtered = [...tickets];

    if (startDate) {
      filtered = filtered.filter(
        (ticket) => new Date(ticket.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (ticket) =>
          new Date(ticket.createdAt) <= new Date(endDate + "T23:59:59")
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, startDate, endDate]);

  useEffect(() => {
    filterTickets();
  }, [filterTickets]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          รายงานการทำงานทั้งหมด
        </h1>
        <p className="text-lg text-gray-600">
          จัดการและติดตามรายงานการทำงานจากพนักงาน
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">รายงานทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTickets.length} รายการ
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">รายได้รวม</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                filteredTickets.reduce((sum, ticket) => sum + ticket.price, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-3">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">กรองตามวันที่</h2>
        </div>

        {/* Quick Date Selection */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">เลือกช่วงเวลา:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const today = new Date();
                const todayStr = today.toISOString().split("T")[0];
                setStartDate(todayStr);
                setEndDate(todayStr);
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              วันนี้
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                setStartDate(weekAgo.toISOString().split("T")[0]);
                setEndDate(today.toISOString().split("T")[0]);
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              รายสัปดาห์
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                setStartDate(monthAgo.toISOString().split("T")[0]);
                setEndDate(today.toISOString().split("T")[0]);
              }}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              รายเดือน
            </button>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
            >
              {showCalendar ? "ซ่อนปฏิทิน" : "แสดงปฏิทิน"}
            </button>
          </div>
        </div>

        {/* Calendar */}
        {showCalendar && (
          <div className="mb-6 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  const prevMonth = new Date(currentMonth);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setCurrentMonth(prevMonth);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                {currentMonth.toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                })}
              </h3>
              <button
                onClick={() => {
                  const nextMonth = new Date(currentMonth);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setCurrentMonth(nextMonth);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
                <div key={day} className="p-2 font-medium text-gray-600">
                  {day}
                </div>
              ))}

              {(() => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const firstDay = new Date(year, month, 1);
                const calendarStart = new Date(firstDay);
                calendarStart.setDate(firstDay.getDate() - firstDay.getDay());

                const days = [];
                for (let i = 0; i < 42; i++) {
                  const date = new Date(calendarStart);
                  date.setDate(calendarStart.getDate() + i);
                  const dateStr = date.toISOString().split("T")[0];
                  const isCurrentMonth = date.getMonth() === month;
                  const isToday =
                    dateStr === new Date().toISOString().split("T")[0];
                  const isSelected =
                    dateStr === startDate || dateStr === endDate;

                  days.push(
                    <button
                      key={i}
                      onClick={() => {
                        if (!startDate) {
                          setStartDate(dateStr);
                        } else if (!endDate) {
                          setEndDate(dateStr);
                        } else {
                          setStartDate(dateStr);
                          setEndDate("");
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isCurrentMonth
                          ? isSelected
                            ? "bg-blue-500 text-white"
                            : isToday
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-200"
                          : "text-gray-400"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                }
                return days;
              })()}
            </div>
          </div>
        )}

        {/* Manual Date Selection */}
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>

        {/* Selected Date Range Display */}
        {(startDate || endDate) && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">ช่วงเวลาที่เลือก:</span>{" "}
              {startDate
                ? new Date(startDate).toLocaleDateString("th-TH")
                : "ไม่จำกัด"}
              {" - "}
              {endDate
                ? new Date(endDate).toLocaleDateString("th-TH")
                : "ไม่จำกัด"}
            </p>
          </div>
        )}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ไม่พบรายงานการทำงาน
            </h3>
            <p className="text-gray-500">
              ไม่พบรายงานการทำงานในช่วงเวลาที่เลือก
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ช่างที่ทำ</p>
                          <p className="font-semibold text-gray-900">
                            {ticket.workerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ราคา</p>
                          <p className="font-semibold text-lg text-green-600">
                            {formatCurrency(ticket.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {ticket.description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-1">รายละเอียด</p>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                          {ticket.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    {ticket.imageUrl && (
                      <div className="relative group w-full sm:w-auto">
                        <div className="relative">
                          <Image
                            src={ticket.imageUrl}
                            alt={`ผลงานของ ${ticket.workerName}`}
                            width={128}
                            height={128}
                            className="w-full h-48 sm:w-32 sm:h-32 object-cover bg-white rounded-xl border border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                            onClick={() => {
                              if (ticket.imageUrl) {
                                openImageModal(ticket.imageUrl);
                              }
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const errorDiv = document.createElement("div");
                                errorDiv.className =
                                  "w-full h-48 sm:w-32 sm:h-32 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xs text-center";
                                errorDiv.innerHTML =
                                  "<div>📷<br/>รูปภาพ<br/>โหลดไม่ได้</div>";
                                parent.appendChild(errorDiv);
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center pointer-events-none">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-semibold bg-gray-500 bg-opacity-80 px-3 py-2 rounded-lg shadow-lg border border-white border-opacity-20">
                              <Eye className="w-4 h-4 inline" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="ผลงานเต็มขนาด"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-white border-2 bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
