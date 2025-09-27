import { NextRequest, NextResponse } from "next/server";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_FOLDER,
  generateUploadSignature,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";

interface SignaturePayload {
  folder?: string;
  publicId?: string;
  tags?: string[];
}

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          message:
            "Cloudinary environment variables are not fully configured on the server.",
        },
        { status: 500 }
      );
    }

    let body: SignaturePayload = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = body.folder?.trim() || CLOUDINARY_UPLOAD_FOLDER;

    const params: Record<string, string | number> = { timestamp };
    if (folder) {
      params.folder = folder;
    }

    if (body.publicId && body.publicId.trim()) {
      params.public_id = body.publicId.trim();
    }

    if (Array.isArray(body.tags) && body.tags.length > 0) {
      params.tags = body.tags.filter(Boolean).join(",");
    }

    const signature = generateUploadSignature(params);

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    console.error("Failed to generate Cloudinary signature", error);

    return NextResponse.json(
      {
        message: "Failed to generate Cloudinary signature",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
