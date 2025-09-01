"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import {
  FileText,
  User,
  DollarSign,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

const useUser = [
  {
    name: "อั้ม",
  },
  {
    name: "ทิวลิป",
  },
];

export default function WorkReportPage() {
  const [price, setPrice] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("price", price);
      formData.append("workerName", workerName);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/work-tickets", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setPrice("");
        setWorkerName("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        throw new Error("Failed to submit work report");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          รายงานการทำงาน
        </h1>
        <p className="text-lg text-gray-600">
          บันทึกงานที่ทำเสร็จแล้วเพื่อติดตามและจัดการ
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                ส่งรายงานการทำงานเรียบร้อยแล้ว
              </h3>
              <p className="text-sm text-green-700 mt-1">
                ระบบได้บันทึกข้อมูลและส่งไปยังผู้ดูแลแล้ว
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            ข้อมูลงานที่ทำเสร็จแล้ว
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Price and Worker Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                ราคาที่ทำ (บาท)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
              <p className="mt-1 text-xs text-gray-500">
                กรุณากรอกราคาที่ลูกค้าจ่ายจริง
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                ช่างที่ทำ
              </label>
              <select
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                {useUser.map((user) => (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-xs text-gray-500">
                กรอกชื่อช่างที่รับผิดชอบงานนี้
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดงาน (ไม่บังคับ)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={4}
              placeholder="อธิบายรายละเอียดงานที่ทำ เช่น ประเภทเล็บ, สีที่ใช้, เทคนิคพิเศษ..."
            />
            <p className="mt-1 text-xs text-gray-500">
              อธิบายงานที่ทำเพื่อให้ผู้ดูแลเข้าใจรายละเอียด
            </p>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-purple-600" />
              รูปภาพผลงาน (ไม่บังคับ)
            </label>

            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview of uploaded work image"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  รูปภาพที่เลือก: {imageFile?.name}
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                    </p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์: JPG, PNG, GIF ขนาดไม่เกิน 5MB
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="absolute inset-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Auto Timestamp Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  ข้อมูลอัตโนมัติ
                </p>
                <p className="text-sm text-blue-700">
                  ระบบจะบันทึกวันเวลาที่ส่งงานเข้ามาอัตโนมัติ
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  กำลังส่งข้อมูล...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  ยืนยันการส่งงาน
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <AlertCircle className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-sm text-gray-600">
            หากมีปัญหาในการส่งข้อมูล กรุณาติดต่อผู้ดูแลระบบ
          </span>
        </div>
      </div>
    </div>
  );
}
