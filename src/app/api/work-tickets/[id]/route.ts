import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// DELETE - ลบ Work Ticket
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "ไม่พบ ID ของรายการที่ต้องการลบ" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี ticket นี้อยู่หรือไม่
    const existingTicket = await prisma.workTicket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { message: "ไม่พบรายการที่ต้องการลบ" },
        { status: 404 }
      );
    }

    // ลบ ticket
    await prisma.workTicket.delete({
      where: { id },
    });

    console.log(`✅ Work ticket deleted successfully: ${id}`);

    return NextResponse.json(
      { message: "ลบรายการเรียบร้อยแล้ว", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);

    let errorMessage = "ไม่สามารถลบรายการได้";
    const statusCode = 500;

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // จัดการ error ต่างๆ
      if (
        error.message.includes("Database") ||
        error.message.includes("Prisma")
      ) {
        errorMessage = "เกิดปัญหาในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง";
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

// PATCH - อัปเดตสถานะ Work Ticket
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await req.json();

    // Allow updating multiple fields: status, price, workerName, description, occurredAt
    const updateData: Prisma.WorkTicketUpdateInput = {};

    if (typeof payload.status === "string") {
      const validStatuses = ["pending", "completed", "cancelled"];
      if (!validStatuses.includes(payload.status)) {
        return NextResponse.json(
          { message: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = payload.status;
    }

    if (typeof payload.price !== "undefined") {
      const num = Number(payload.price);
      if (isNaN(num)) {
        return NextResponse.json({ message: "Invalid price" }, { status: 400 });
      }
      updateData.price = num;
    }

    if (typeof payload.workerName === "string") {
      updateData.workerName = payload.workerName;
    }

    if (typeof payload.description !== "undefined") {
      updateData.description = payload.description || null;
    }

    if (typeof payload.occurredAt === "string") {
      const date = new Date(payload.occurredAt);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { message: "Invalid occurredAt date" },
          { status: 400 }
        );
      }
      updateData.occurredAt = date;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const ticket = await prisma.workTicket.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);

    let errorMessage = "ไม่สามารถแก้ไขรายการได้";
    let statusCode = 500;

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // จัดการ error ต่างๆ
      if (
        error.message.includes("Database") ||
        error.message.includes("Prisma")
      ) {
        errorMessage = "เกิดปัญหาในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง";
      } else if (error.message.includes("Record to update not found")) {
        errorMessage = "ไม่พบรายการที่ต้องการแก้ไข";
        statusCode = 404;
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
