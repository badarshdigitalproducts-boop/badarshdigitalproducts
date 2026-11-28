import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const R2_ACCOUNT_ID =
  process.env.CLOUDFLARE_R2_ACCOUNT_ID ||
  process.env.R2_ACCOUNT_ID ||
  process.env.NEXT_PUBLIC_R2_ACCOUNT_ID ||
  "";

const R2_ACCESS_KEY_ID =
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
  process.env.R2_ACCESS_KEY_ID ||
  "";

const R2_SECRET_ACCESS_KEY =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  process.env.R2_SECRET_ACCESS_KEY ||
  "";

const R2_BUCKET_NAME =
  process.env.CLOUDFLARE_R2_BUCKET_NAME ||
  process.env.R2_BUCKET_NAME ||
  "badarsh-assets";

const R2_PUBLIC_URL =
  process.env.CLOUDFLARE_R2_PUBLIC_URL ||
  process.env.R2_PUBLIC_URL ||
  "";

let s3ClientInstance: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

export function getR2Client(): S3Client {
  if (!s3ClientInstance) {
    if (!isR2Configured()) {
      throw new Error("Cloudflare R2 credentials are not configured in environment variables.");
    }

    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3ClientInstance;
}

/**
 * Generate a pre-signed, time-limited download URL for a file in Cloudflare R2.
 * @param key Object key in R2 (e.g. "bundles/viral-sfx-master.zip")
 * @param expiresInSeconds Expiration duration (default 14400 = 4 hours)
 */
let devEphemeralSigningKey: string | null = null;

export function getDownloadSigningKey(): string {
  const configured =
    process.env.DOWNLOAD_SIGNING_KEY?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === "production") {
    return "";
  }
  if (!devEphemeralSigningKey) {
    devEphemeralSigningKey = crypto.randomBytes(32).toString("hex");
  }
  return devEphemeralSigningKey;
}

export async function generateR2DownloadUrl(
  key: string,
  expiresInSeconds: number = 14400
): Promise<string> {
  if (!isR2Configured()) {
    const signingKey = getDownloadSigningKey();
    if (!signingKey) {
      throw new Error("Download signing key is not configured on the server");
    }
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const token = crypto
      .createHmac("sha256", signingKey)
      .update(`${key}:${expiresAt}`)
      .digest("hex");
    return `/api/download?key=${encodeURIComponent(key)}&token=${token}&exp=${expiresAt}`;
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate a pre-signed upload URL so the browser can upload large files (e.g. 500MB ZIPs)
 * directly to Cloudflare R2 without passing through Vercel's 4.5MB serverless limit.
 */
export async function generateR2UploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600
): Promise<{ uploadUrl: string; key: string; publicUrl?: string }> {
  if (!isR2Configured()) {
    return {
      uploadUrl: `/api/admin/upload`,
      key,
    };
  }

  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  const publicUrl = R2_PUBLIC_URL ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}` : undefined;

  return { uploadUrl, key, publicUrl };
}

/**
 * Direct server-side upload of a buffer into Cloudflare R2
 */
export async function uploadBufferToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
    : `r2://${R2_BUCKET_NAME}/${key}`;
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured()) return false;
  try {
    const client = getR2Client();
    await client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (err) {
    console.error("Error deleting from R2:", err);
    return false;
  }
}
