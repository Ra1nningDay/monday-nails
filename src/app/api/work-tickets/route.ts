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
    const formData = await req.formData();
    const price = parseFloat(formData.get("price") as string);
    const workerName = formData.get("workerName") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    if (!price || !workerName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
        const timestamp = Date.now();
        const fileExtension = imageFile.name.split(".").pop();
        const fileName = `work-${timestamp}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);

        // แปลง File เป็น Buffer และบันทึก
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // สร้าง URL สำหรับเข้าถึงรูปภาพ
        imageUrl = `/uploads/${fileName}`;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        // ถ้าอัพโหลดรูปภาพไม่สำเร็จ ให้สร้าง ticket โดยไม่มีรูปภาพ
        imageUrl = null;
      }
    }

    const ticket = await prisma.workTicket.create({
      data: {
        price,
        workerName,
        description: description || null,
        imageUrl,
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
