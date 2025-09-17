import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { Prisma } from "@prisma/client";

// GET - ดึง Work Tickets ทั้งหมด
export async function GET() {
  try {
    const tickets = await prisma.workTicket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// POST - สร้าง Work Ticket ใหม่
export async function POST(req: NextRequest) {
  try {
    console.log("=== API Route Called ===");

    // Check content-length to provide better error messages
    const contentLength = req.headers.get("content-length");
    if (contentLength) {
      const sizeMB = parseInt(contentLength) / (1024 * 1024);
      console.log(`Request size: ${sizeMB.toFixed(2)}MB`);

      // Vercel has a 4.5MB limit for serverless functions
      if (sizeMB > 4.5) {
        return NextResponse.json(
          {
            message: "ขนาดไฟล์ใหญ่เกินไป กรุณาลดขนาดรูปภาพหรือจำนวนรูปภาพ",
            details: `ขนาดปัจจุบัน: ${sizeMB.toFixed(2)}MB, ขนาดสูงสุด: 4.5MB`,
          },
          { status: 413 }
        );
      }
    }

    const formData = await req.formData();

    // Log all form data entries
    console.log("Form data entries:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value
      );
    }

    const price = parseFloat(formData.get("price") as string);
    const workerName = formData.get("workerName") as string;
    const description = formData.get("description") as string;
    const occurredAtRaw = formData.get("occurredAt") as string | null;

    console.log("Parsed data:", {
      price,
      workerName,
      description,
      occurredAtRaw,
    });

    // Handle multiple images
    const imageFiles: File[] = [];
    let totalImageSize = 0;

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image") && value instanceof File) {
        // Validate image file
        if (!value.type.startsWith("image/")) {
          return NextResponse.json(
            { message: `ไฟล์ "${value.name}" ไม่ใช่รูปภาพ` },
            { status: 400 }
          );
        }

        // Check individual file size (2MB limit)
        const maxFileSize = 2 * 1024 * 1024; // 2MB
        if (value.size > maxFileSize) {
          return NextResponse.json(
            {
              message: `รูปภาพ "${value.name}" มีขนาดใหญ่เกินไป`,
              details: `ขนาด: ${(value.size / 1024 / 1024).toFixed(
                2
              )}MB, สูงสุด: 2MB`,
            },
            { status: 400 }
          );
        }

        totalImageSize += value.size;
        imageFiles.push(value);
        console.log(
          "Found image file:",
          key,
          value.name,
          `${(value.size / 1024).toFixed(2)}KB`
        );
      }
    }

    console.log(
      `Total images: ${imageFiles.length}, Total size: ${(
        totalImageSize /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    if (!price || !workerName) {
      console.log("Missing required fields:", { price, workerName });
      return NextResponse.json(
        { message: "Missing required fields", details: { price, workerName } },
        { status: 400 }
      );
    }

    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        console.log(
          "🚀 Starting Cloudinary upload for",
          imageFiles.length,
          "files"
        );

        // เช็ค Cloudinary config
        console.log("📋 Cloudinary Config:", {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
            ? "***set***"
            : "***not set***",
        });

        // Upload รูปภาพไป Cloudinary
        console.log(
          `🚀 Starting Cloudinary upload for ${imageFiles.length} files...`
        );
        imageUrls = await uploadMultipleImages(
          imageFiles,
          "monday-nail/work-images"
        );
        console.log(
          "✅ Images uploaded to Cloudinary successfully:",
          imageUrls.length,
          "images"
        );
      } catch (uploadError) {
        console.error("❌ Error uploading images to Cloudinary:", uploadError);
        console.error(
          "❌ Upload error details:",
          uploadError instanceof Error
            ? {
                message: uploadError.message,
                stack: uploadError.stack,
                name: uploadError.name,
              }
            : uploadError
        );
        // ถ้าอัพโหลดรูปภาพไม่สำเร็จ ให้สร้าง ticket โดยไม่มีรูปภาพ
        imageUrls = [];
      }
    }

    console.log("📝 Final imageUrls before saving:", imageUrls);

    // Parse occurredAt (if provided) as local date at midnight
    let occurredAt: Date | undefined = undefined;
    if (occurredAtRaw) {
      try {
        // Support YYYY-MM-DD (date input) or ISO string
        const date = new Date(occurredAtRaw);
        if (!isNaN(date.getTime())) {
          occurredAt = date;
        }
      } catch {
        // ignore parse error; fallback to default(now()) in DB
      }
    }

    const createData: Prisma.WorkTicketCreateInput = {
      price,
      workerName,
      description: description || null,
      imageUrls: imageUrls.length > 0 ? imageUrls : Prisma.DbNull,
      status: "completed",
    };
    if (occurredAt) {
      createData.occurredAt = occurredAt;
    }

    const ticket = await prisma.workTicket.create({
      data: createData,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);

    // ให้ error message ที่ชัดเจนขึ้น
    let errorMessage = "Failed to create ticket";
    let statusCode = 500;

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // จัดการ error ต่างๆ
      if (error.message.includes("Cloudinary")) {
        errorMessage = "เกิดปัญหาในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง";
      } else if (
        error.message.includes("Database") ||
        error.message.includes("Prisma")
      ) {
        errorMessage = "เกิดปัญหาในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง";
      } else if (error.message.includes("timeout")) {
        errorMessage = "การประมวลผลใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง";
        statusCode = 408;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        message: errorMessage,
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    );
  }
}
