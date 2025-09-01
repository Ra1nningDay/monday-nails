/**
 * Image compression and validation utilities
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export const DEFAULT_COMPRESS_OPTIONS: CompressOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 2048, // 2MB
};

/**
 * Compress image file
 */
export async function compressImage(
  file: File,
  options: CompressOptions = DEFAULT_COMPRESS_OPTIONS
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      reject(new Error("ไฟล์ต้องเป็นรูปภาพเท่านั้น"));
      return;
    }

    // Check original file size
    const maxBytes =
      (options.maxSizeKB || DEFAULT_COMPRESS_OPTIONS.maxSizeKB!) * 1024;
    if (file.size <= maxBytes) {
      // File is already small enough
      resolve(file);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = calculateDimensions(
        img.width,
        img.height,
        options.maxWidth || DEFAULT_COMPRESS_OPTIONS.maxWidth!,
        options.maxHeight || DEFAULT_COMPRESS_OPTIONS.maxHeight!
      );

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("ไม่สามารถบีบอัดรูปภาพได้"));
            return;
          }

          // Create new file
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, ".jpg"), // Force JPG for better compression
            { type: "image/jpeg" }
          );

          console.log(
            `Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(
              compressedFile.size / 1024
            ).toFixed(2)}KB`
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        options.quality || DEFAULT_COMPRESS_OPTIONS.quality
      );
    };

    img.onerror = () => reject(new Error("ไม่สามารถโหลดรูปภาพได้"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Scale down if necessary
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Validate file before processing
 */
export function validateImageFile(file: File): string | null {
  // Check file type
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    return "รองรับเฉพาะไฟล์ JPG, PNG, GIF, WebP เท่านั้น";
  }

  // Check file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return "ขนาดไฟล์ต้องไม่เกิน 10MB";
  }

  return null;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
