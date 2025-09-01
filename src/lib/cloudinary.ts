import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("🔧 Cloudinary configured with:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "***set***" : "***not set***",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***set***" : "***not set***",
});

export default cloudinary;

// Helper function สำหรับ upload รูปภาพ
export async function uploadImageToCloudinary(
  file: File,
  folder: string = "monday-nail/work-images"
): Promise<string> {
  try {
    console.log(
      "📤 Starting upload for file:",
      file.name,
      "size:",
      `${(file.size / 1024).toFixed(2)}KB`,
      "type:",
      file.type
    );

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB > 2MB`
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    console.log("🔄 Uploading to Cloudinary folder:", folder);

    // Upload to Cloudinary with timeout
    const uploadPromise = cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto",
      quality: "auto:good", // Better compression
      fetch_format: "auto",
      timeout: 60000, // 60 second timeout
    });

    // Add timeout wrapper
    const result = (await Promise.race([
      uploadPromise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Upload timeout after 60 seconds")),
          60000
        )
      ),
    ])) as UploadApiResponse;

    console.log("✅ Upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    });

    return result.secure_url;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        throw new Error(
          `การอัพโหลด "${file.name}" ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง`
        );
      } else if (error.message.includes("File too large")) {
        throw new Error(
          `ไฟล์ "${file.name}" มีขนาดใหญ่เกินไป (ขนาดสูงสุด 2MB)`
        );
      }
    }

    throw new Error(`ไม่สามารถอัพโหลดไฟล์ "${file.name}" ได้`);
  }
}

// Helper function สำหรับ upload หลายรูป
export async function uploadMultipleImages(
  files: File[],
  folder: string = "monday-nail/work-images"
): Promise<string[]> {
  if (files.length === 0) return [];

  try {
    console.log(`🚀 Starting batch upload for ${files.length} files`);

    // Upload images one by one to avoid memory issues and rate limits
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📤 Uploading image ${i + 1}/${files.length}: ${file.name}`);

      try {
        const url = await uploadImageToCloudinary(file, folder);
        urls.push(url);
        console.log(`✅ Image ${i + 1} uploaded successfully`);

        // Small delay to avoid rate limits
        if (i < files.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Failed to upload image ${i + 1}:`, error);
        // Continue with other images, but log the error
        throw error; // Re-throw to maintain error handling behavior
      }
    }

    console.log(
      `✅ Batch upload completed: ${urls.length}/${files.length} images uploaded`
    );
    return urls;
  } catch (error) {
    console.error("❌ Error in batch upload:", error);
    throw new Error("ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
  }
}
