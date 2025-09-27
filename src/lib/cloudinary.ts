import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const CLOUDINARY_UPLOAD_FOLDER =
  process.env.CLOUDINARY_UPLOAD_FOLDER ?? "monday-nail/work-images";

const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};

export const missingCloudinaryEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingCloudinaryEnvVars.length === 0) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "Cloudinary environment variables are missing:",
    missingCloudinaryEnvVars
  );
}

export function isCloudinaryConfigured(): boolean {
  return missingCloudinaryEnvVars.length === 0;
}

export function assertCloudinaryConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      `Cloudinary is not configured. Missing variables: ${missingCloudinaryEnvVars.join(", ")}`
    );
  }
}

export function generateUploadSignature(
  params: Record<string, string | number>
): string {
  assertCloudinaryConfigured();
  return cloudinary.utils.api_sign_request(
    params,
    CLOUDINARY_API_SECRET
  );
}

export {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_FOLDER,
};

export default cloudinary;
