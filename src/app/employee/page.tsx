"use client";

import { useEffect, useMemo, useState, FormEvent, useCallback } from "react";
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
  Loader2,
  Trash2,
} from "lucide-react";
import {
  compressImage,
  validateImageFile,
  formatFileSize,
} from "@/utils/imageUtils";

function toLocalDateInputValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

const useUser = [{ name: "อั้ม" }, { name: "ทิวลิป" }];

export default function WorkReportPage() {
  const [price, setPrice] = useState("");
  const [workerName, setWorkerName] = useState(useUser[0]?.name || "");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [processingImages, setProcessingImages] = useState(false);
  // วันที่ทำงาน (occurredAt) เริ่มต้นเป็นวันนี้ (ตามเขตเวลาเครื่อง)
  const todayLocal = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const [occurredAt, setOccurredAt] = useState<string>(todayLocal);

  // สถานะแก้ไข + รายการล่าสุด
  type WorkTicketDto = {
    id: string;
    price: number;
    workerName: string;
    description?: string | null;
    status: string;
    imageUrls?: string[] | null;
    occurredAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  const [tickets, setTickets] = useState<WorkTicketDto[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>(todayLocal);
  const filteredTickets = useMemo(() => {
    if (!filterDate) {
      return tickets;
    }
    return tickets.filter((ticket) => {
      const sourceDate = ticket.occurredAt || ticket.createdAt;
      if (!sourceDate) {
        return false;
      }
      return toLocalDateInputValue(sourceDate) === filterDate;
    });
  }, [tickets, filterDate]);
  const hasActiveFilter = Boolean(filterDate);

  const fetchTickets = useCallback(async (): Promise<void> => {
    try {
      setListLoading(true);
      const res = await fetch("/api/work-tickets", { cache: "no-store" });
      if (!res.ok) return;
      const data: WorkTicketDto[] = await res.json();
      setTickets(data);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = async (ticketId: string) => {
    // ถ้ากำลังแก้ไขรายการนี้อยู่ ให้แจ้งเตือนเป็นพิเศษ
    const isEditingThis = isEditing && editingId === ticketId;
    const confirmMessage = isEditingThis
      ? "คุณกำลังแก้ไขรายการนี้อยู่ หากลบแล้วข้อมูลที่แก้ไขจะหายไป คุณแน่ใจหรือไม่?"
      : "คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การลบไม่สามารถย้อนกลับได้";

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setDeletingId(ticketId);
      const response = await fetch(`/api/work-tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "ไม่สามารถลบรายการได้";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status} Error`;
        }
        throw new Error(errorMessage);
      }

      // ลบสำเร็จ - refresh รายการ
      await fetchTickets();

      // แสดงข้อความสำเร็จ
      setSuccess(true);
      setSuccessMessage("ลบรายการเรียบร้อยแล้ว");
      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 3000);

      // ถ้ากำลังแก้ไขรายการที่ถูกลบ ให้ยกเลิกการแก้ไข
      if (editingId === ticketId) {
        setIsEditing(false);
        setEditingId(null);
        setPrice("");
        setWorkerName(useUser[0]?.name || "");
        setDescription("");
        setOccurredAt(todayLocal);
        setImageFiles([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      const errorMessage =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการลบรายการ";
      alert(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setProcessingImages(true);
    setUploadProgress("กำลังประมวลผลรูปภาพ...");

    try {
      // จำกัดจำนวนรูปภาพไม่เกิน 5 รูป
      const remainingSlots = 5 - imageFiles.length;
      const filesToProcess = files.slice(0, remainingSlots);

      const processedFiles: File[] = [];
      const newPreviews: string[] = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        setUploadProgress(
          `กำลังประมวลผลรูปภาพ ${i + 1}/${filesToProcess.length}...`
        );

        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
          alert(`รูปภาพ "${file.name}": ${validationError}`);
          continue;
        }

        try {
          // Compress image
          const compressedFile = await compressImage(file);
          processedFiles.push(compressedFile);

          // Create preview
          const previewUrl = URL.createObjectURL(compressedFile);
          newPreviews.push(previewUrl);

          console.log(`Image processed: ${file.name}`, {
            originalSize: formatFileSize(file.size),
            compressedSize: formatFileSize(compressedFile.size),
            compression: `${(
              ((file.size - compressedFile.size) / file.size) *
              100
            ).toFixed(1)}%`,
          });
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          alert(`ไม่สามารถประมวลผลรูปภาพ "${file.name}" ได้`);
        }
      }

      if (processedFiles.length > 0) {
        setImageFiles((prev) => [...prev, ...processedFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      alert("เกิดข้อผิดพลาดในการประมวลผลรูปภาพ");
    } finally {
      setProcessingImages(false);
      setUploadProgress("");
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const previewUrl = imagePreviews[index];
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (files.length === 0) {
        return [];
      }

      setUploadProgress("กำลังเตรียมอัปโหลดรูปภาพ...");
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!signatureResponse.ok) {
        let message = "ไม่สามารถเตรียมการอัปโหลดรูปภาพได้";
        try {
          const errorData = await signatureResponse.json();
          message = errorData.message || message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const signatureData = (await signatureResponse.json()) as {
        timestamp: number;
        signature: string;
        apiKey: string;
        cloudName: string;
        folder?: string;
      };

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`;
      const uploadedUrls: string[] = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setUploadProgress(`กำลังอัปโหลดรูปภาพ ${index + 1}/${files.length}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", String(signatureData.timestamp));
        if (signatureData.folder)
          formData.append("folder", signatureData.folder);
        formData.append("signature", signatureData.signature);

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          let errorMessage = "อัปโหลดรูปภาพไปยัง Cloudinary ไม่สำเร็จ";
          try {
            const errorData = await uploadResponse.json();
            errorMessage =
              errorData?.error?.message || errorData?.message || errorMessage;
          } catch {
            // ignore
          }
          throw new Error(errorMessage);
        }

        const uploadResult = await uploadResponse.json();
        if (!uploadResult?.secure_url)
          throw new Error("ไม่พบลิงก์รูปภาพจาก Cloudinary");
        uploadedUrls.push(uploadResult.secure_url as string);
      }
      return uploadedUrls;
    },
    []
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!price || !workerName) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน (ราคาและช่างผู้ทำ)");
      return;
    }
    const priceNumber = parseFloat(price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      alert("กรุณากรอกราคาที่ถูกต้อง (ต้องมากกว่า 0)");
      return;
    }
    if (!occurredAt) {
      alert("กรุณาเลือกวันที่ทำงาน");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setUploadProgress("กำลังเตรียมข้อมูล...");

    try {
      let response: Response;
      if (isEditing && editingId) {
        setUploadProgress("กำลังอัปเดตรายการ...");
        response = await fetch(`/api/work-tickets/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: priceNumber,
            workerName,
            description,
            occurredAt,
          }),
        });
      } else {
        let uploadedUrls: string[] = [];
        if (imageFiles.length > 0)
          uploadedUrls = await uploadImagesToCloudinary(imageFiles);
        setUploadProgress("กำลังบันทึกข้อมูล...");
        response = await fetch("/api/work-tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: priceNumber,
            workerName,
            description,
            occurredAt,
            imageUrls: uploadedUrls,
          }),
        });
      }

      if (!response.ok) {
        let errorMessage = "ส่งรายงานไม่สำเร็จ";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || `HTTP ${response.status} Error`;
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setSuccessMessage(
        isEditing
          ? "แก้ไขรายการเรียบร้อยแล้ว"
          : "ส่งรายงานการทำงานเรียบร้อยแล้ว"
      );
      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 3000);
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
      setPrice("");
      setWorkerName("");
      setDescription("");
      setImageFiles([]);
      setImagePreviews([]);
      setOccurredAt(todayLocal);
      if (isEditing) {
        setIsEditing(false);
        setEditingId(null);
      }
      fetchTickets();
    } catch (error) {
      console.error("Error submitting work report:", error);
      let errorMessage = "เกิดข้อผิดพลาดในการส่งข้อมูล";
      if (error instanceof Error) errorMessage = error.message;
      if (errorMessage.includes("Failed to fetch")) {
        errorMessage =
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
      } else if (errorMessage.includes("timeout")) {
        errorMessage = "ใช้เวลาส่งข้อมูลนานเกินไป กรุณาลองใหม่อีกครั้ง";
      } else if (errorMessage.includes("Cloudinary")) {
        errorMessage =
          "เกิดปัญหาในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้งหรือลดขนาดรูปภาพ";
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress("");
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

      {/* Progress Indicator */}
      {(processingImages || loading) && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-400 mr-2 animate-spin" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                {processingImages ? "กำลังประมวลผลรูปภาพ" : "กำลังส่งข้อมูล"}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {uploadProgress || "กรุณารอสักครู่..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                {successMessage || "ส่งรายงานการทำงานเรียบร้อยแล้ว"}
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
            {isEditing ? "แก้ไขรายการงาน" : "ข้อมูลงานที่ทำเสร็จแล้ว"}
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
                <option value="">-- เลือกช่าง --</option>
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

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                วันที่ทำรายการ
              </label>
              <input
                type="date"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                max={todayLocal}
              />
              <p className="mt-1 text-xs text-gray-500">
                ค่าเริ่มต้นเป็นวันที่ปัจจุบัน
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
                    <div key={index} className="relative group">
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        disabled={processingImages || loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                        {formatFileSize(imageFiles[index]?.size || 0)}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  รูปภาพที่เลือก: {imageFiles.length} รูป
                  {imageFiles.length > 0 && (
                    <span className="ml-2 text-xs text-gray-500">
                      (รวม:{" "}
                      {formatFileSize(
                        imageFiles.reduce((total, file) => total + file.size, 0)
                      )}
                      )
                    </span>
                  )}
                </p>
              </div>
            ) : null}

            {imagePreviews.length < 5 && (
              <div className="relative">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    processingImages || loading || isEditing
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <Upload
                    className={`mx-auto h-12 w-12 mb-4 ${
                      processingImages || loading || isEditing
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="space-y-2">
                    <p
                      className={`text-sm ${
                        processingImages || loading || isEditing
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {processingImages
                        ? "กำลังประมวลผลรูปภาพ..."
                        : loading
                        ? "กำลังส่งข้อมูล..."
                        : "คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่"}
                    </p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์: JPG, PNG, GIF, WebP ขนาดไม่เกิน 10MB (สูงสุด 5
                      รูป)
                      <br />
                      <span className="text-blue-600">
                        รูปภาพจะถูกบีบอัดอัตโนมัติเพื่อประสิทธิภาพที่ดีขึ้น
                      </span>
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
                  disabled={processingImages || loading || isEditing}
                />
                {!(processingImages || loading || isEditing) && (
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 cursor-pointer"
                  />
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  วันที่ทำงานสามารถเลือกย้อนหลังได้
                </p>
                <p className="text-sm text-blue-700">ค่าเริ่มต้นเป็นวันนี้</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || processingImages}
              className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  {uploadProgress ||
                    (isEditing ? "กำลังอัปเดต..." : "กำลังส่งข้อมูล...")}
                </div>
              ) : processingImages ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  กำลังประมวลผลรูปภาพ...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isEditing ? "บันทึกการแก้ไข" : "ยืนยันการส่งงาน"}
                </div>
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setPrice("");
                  setWorkerName("");
                  setDescription("");
                  setOccurredAt(todayLocal);
                  setImageFiles([]);
                  setImagePreviews([]);
                }}
                className="mt-3 w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50"
              >
                ยกเลิกการแก้ไข
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b space-y-3 md:flex md:items-center md:justify-between md:space-y-0">
          <h3 className="text-lg font-semibold">รายการล่าสุด</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label
              htmlFor="ticket-filter-date"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              เลือกวันที่
            </label>
            <input
              id="ticket-filter-date"
              type="date"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {filterDate && (
              <button
                type="button"
                onClick={() => setFilterDate("")}
                className="text-xs text-blue-600 hover:underline"
              >
                ล้างตัวกรอง
              </button>
            )}
            <span className="text-xs text-gray-500">
              แสดง {filteredTickets.length} จาก {tickets.length}
            </span>
          </div>
        </div>
        <div className="divide-y">
          {listLoading && (
            <div className="p-4 text-sm text-gray-500">กำลังโหลดรายการ...</div>
          )}
          {!listLoading && filteredTickets.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              {hasActiveFilter
                ? "ไม่พบรายการงานสำหรับวันที่เลือก"
                : "ยังไม่มีรายการ"}
            </div>
          )}
          {!listLoading &&
            filteredTickets.length > 0 &&
            filteredTickets.map((t) => {
              const dateText = t.occurredAt || t.createdAt;
              const priceText = new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
                maximumFractionDigits: 2,
              }).format(t.price || 0);

              const isCurrentlyEditing = isEditing && editingId === t.id;
              const isCurrentlyDeleting = deletingId === t.id;

              return (
                <div
                  key={t.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isCurrentlyEditing
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : isCurrentlyDeleting
                      ? "bg-red-50 opacity-75"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate flex items-center">
                      {t.workerName} • {priceText}
                      {isCurrentlyEditing && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          กำลังแก้ไข
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {t.description || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      วันที่ทำงาน:{" "}
                      {new Date(dateText).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setIsEditing(true);
                        setEditingId(t.id);
                        setPrice(String(t.price ?? ""));
                        setWorkerName(t.workerName || "");
                        setDescription(t.description || "");
                        const localDateStr =
                          toLocalDateInputValue(t.occurredAt || t.createdAt) ||
                          todayLocal;
                        setOccurredAt(localDateStr);
                        // ไม่รองรับแก้ไขรูปภาพในโหมดแก้ไข
                        setImageFiles([]);
                        setImagePreviews([]);
                      }}
                      disabled={deletingId === t.id || isEditing}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id || isEditing}
                    >
                      {deletingId === t.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          กำลังลบ...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 mr-1" />
                          ลบ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
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
