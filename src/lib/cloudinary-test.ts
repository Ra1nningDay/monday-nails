import cloudinary from "@/lib/cloudinary";

export async function testCloudinaryConnection() {
  try {
    console.log("🧪 Testing Cloudinary connection...");

    // Test ping
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful:", result);

    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error);
    return false;
  }
}
