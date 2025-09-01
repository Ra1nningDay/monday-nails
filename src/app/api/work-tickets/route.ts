import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { testCloudinaryConnection } from "@/lib/cloudinary-test";
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

    console.log("Parsed data:", { price, workerName, description });

    // Handle multiple images
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image") && value instanceof File) {
        imageFiles.push(value);
        console.log("Found image file:", key, value.name);
      }
    }

    console.log("Total image files:", imageFiles.length);

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

        // ทดสอบ connection ก่อน
        const connectionOk = await testCloudinaryConnection();
        if (!connectionOk) {
          throw new Error("Cloudinary connection failed");
        }

        // Upload รูปภาพไป Cloudinary
        imageUrls = await uploadMultipleImages(
          imageFiles,
          "monday-nail/work-images"
        );
        console.log(
          "✅ Images uploaded to Cloudinary successfully:",
          imageUrls
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

    const ticket = await prisma.workTicket.create({
      data: {
        price,
        workerName,
        description: description || null,
        imageUrls: imageUrls.length > 0 ? imageUrls : Prisma.DbNull,
        status: "completed",
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
