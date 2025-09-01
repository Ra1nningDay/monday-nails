import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // อัพโหลดรูปภาพทั้งหมด
        for (const imageFile of imageFiles) {
          // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const fileExtension = imageFile.name.split(".").pop();
          const fileName = `work-${timestamp}-${randomSuffix}.${fileExtension}`;
          const filePath = join(uploadDir, fileName);

          // แปลง File เป็น Buffer และบันทึก
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);

          // เพิ่ม URL ลงใน array
          imageUrls.push(`/uploads/${fileName}`);
        }
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        // ถ้าอัพโหลดรูปภาพไม่สำเร็จ ให้สร้าง ticket โดยไม่มีรูปภาพ
        imageUrls = [];
      }
    }

    const ticket = await prisma.workTicket.create({
      data: {
        price,
        workerName,
        description: description || null,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
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
