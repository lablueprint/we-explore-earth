import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../s3Client";

const EVENT_IMAGE_PREFIX = "events/";
const SIGNED_URL_EXPIRES_IN = 60 * 60;

export function buildEventImageObjectKey(originalFilename: string): string {
  const safe = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${EVENT_IMAGE_PREFIX}${Date.now()}-${safe}`;
}

export async function uploadEventCoverToS3(opts: {
  buffer: Buffer;
  contentType: string;
  originalFilename: string;
}): Promise<{ key: string }> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  const key = buildEventImageObjectKey(opts.originalFilename);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: opts.buffer,
      ContentType: opts.contentType || "application/octet-stream",
    })
  );

  return { key };
}

/** Same idea as avatar signed URLs: clients pass `eventImage` key from Firestore. */
export async function signEventImageKey(key: string): Promise<string> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }
  if (!key.startsWith(EVENT_IMAGE_PREFIX)) {
    throw new Error("Invalid event image key");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}
