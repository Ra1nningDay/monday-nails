import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type CreateWorkTicketPayload = {
  price?: number | string;
  workerName?: string;
  description?: string | null;
  occurredAt?: string | null;
  imageUrls?: string[];
};

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

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as CreateWorkTicketPayload;

    const priceRaw = payload?.price;
    const priceValue =
      typeof priceRaw === "number"
        ? priceRaw
        : typeof priceRaw === "string"
        ? parseFloat(priceRaw)
        : NaN;

    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      return NextResponse.json(
        { message: "Invalid price received" },
        { status: 400 }
      );
    }

    const workerName = payload.workerName?.trim();
    if (!workerName) {
      return NextResponse.json(
        { message: "Worker name is required" },
        { status: 400 }
      );
    }

    const description =
      typeof payload.description === "string" && payload.description.trim().length > 0
        ? payload.description.trim()
        : null;

    let occurredAt: Date | undefined;
    if (payload.occurredAt) {
      const occurredAtDate = new Date(payload.occurredAt);
      if (Number.isNaN(occurredAtDate.getTime())) {
        return NextResponse.json(
          { message: "Invalid occurredAt date" },
          { status: 400 }
        );
      }
      occurredAt = occurredAtDate;
    }

    let imageUrls: string[] = [];
    if (Array.isArray(payload.imageUrls)) {
      imageUrls = payload.imageUrls.map((url) => url.trim()).filter(Boolean);

      if (imageUrls.length > 5) {
        return NextResponse.json(
          { message: "A maximum of 5 images is allowed per ticket" },
          { status: 400 }
        );
      }

      if (imageUrls.length !== payload.imageUrls.length) {
        return NextResponse.json(
          { message: "Image URLs must be non-empty strings" },
          { status: 400 }
        );
      }
    }

    const createData: Prisma.WorkTicketCreateInput = {
      price: priceValue,
      workerName,
      description,
      status: "completed",
    };

    if (occurredAt) {
      createData.occurredAt = occurredAt;
    }

    if (imageUrls.length > 0) {
      createData.imageUrls = imageUrls;
    } else {
      createData.imageUrls = Prisma.DbNull;
    }

    const ticket = await prisma.workTicket.create({
      data: createData,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create ticket";
    return NextResponse.json(
      { message: "Failed to create ticket", error: message },
      { status: 500 }
    );
  }
}
