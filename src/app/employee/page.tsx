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
  X,
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
  const [workerName, setWorkerName] = useState(useUser[0]?.name || "");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // จำกัดจำนวนรูปภาพไม่เกิน 5 รูป
      const newFiles = [...imageFiles, ...files].slice(0, 5);
      setImageFiles(newFiles);

      // สร้าง preview URLs
      const newPreviews = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then((previews) => {
        setImagePreviews((prev) => [...prev, ...previews].slice(0, 5));
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!price || !workerName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (ราคาและช่างที่ทำ)");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("price", price);
      formData.append("workerName", workerName);
      formData.append("description", description);

      // เพิ่มรูปภาพทั้งหมด
      imageFiles.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });

      const response = await fetch("/api/work-tickets", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || "Failed to submit work report");
      }

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setPrice("");
        setWorkerName("");
        setDescription("");
        setImageFiles([]);
        setImagePreviews([]);
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
                <option value="">เลือกช่าง</option>
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
              รูปภาพผลงาน (ไม่บังคับ) - สูงสุด 5 รูป
            </label>

            {imagePreviews.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={128}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  รูปภาพที่เลือก: {imageFiles.length} รูป
                </p>
              </div>
            ) : null}

            {imagePreviews.length < 5 && (
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                    </p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์: JPG, PNG, GIF ขนาดไม่เกิน 5MB (สูงสุด 5 รูป)
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                  multiple
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
