import { v2 as cloudinary } from "cloudinary";

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
      file.size,
      "type:",
      file.type
    );

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    console.log("🔄 Uploading to Cloudinary folder:", folder);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
    });

    console.log("✅ Upload successful:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    });

    return result.secure_url;
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}

// Helper function สำหรับ upload หลายรูป
export async function uploadMultipleImages(
  files: File[],
  folder: string = "monday-nail/work-images"
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToCloudinary(file, folder)
    );
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw new Error("Failed to upload images");
  }
}
