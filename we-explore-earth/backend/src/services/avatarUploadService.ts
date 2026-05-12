import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import admin from "firebase-admin";
import { s3Client, bucketName } from "../s3Client";
import { db } from "../firestore";

const SIGNED_URL_EXPIRES_IN = 60 * 60;
const AVATAR_KEY_PREFIX = "avatars/";

export function buildAvatarObjectKey(originalFilename: string): string {
  const safe = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${AVATAR_KEY_PREFIX}${Date.now()}-${safe}`;
}

export async function signAvatarObjectKey(key: string): Promise<string> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}

/**
 * Uploads one avatar image to S3 under `avatars/…`, appends the object key to
 * Firestore `config/shared` → field `avatars`, and returns the key plus a short-lived signed URL
 * for UI (e.g. onboarding).
 */
export async function uploadAvatarToS3AndFirestore(opts: {
  buffer: Buffer;
  contentType: string;
  originalFilename: string;
}): Promise<{ key: string; url: string }> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  const key = buildAvatarObjectKey(opts.originalFilename);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: opts.buffer,
      ContentType: opts.contentType,
    })
  );

  await db.doc("config/shared").set(
    {
      avatars: admin.firestore.FieldValue.arrayUnion(key),
    },
    { merge: true }
  );

  const url = await signAvatarObjectKey(key);
  return { key, url };
}
