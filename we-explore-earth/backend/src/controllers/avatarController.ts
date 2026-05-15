import { Request, Response } from "express";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import admin from "firebase-admin";
import { db } from "../firestore";
import { s3Client, bucketName } from "../s3Client";

const SIGNED_URL_EXPIRES_IN = 60 * 60;
const AVATAR_KEY_PREFIX = "avatars/";

function buildAvatarObjectKey(originalFilename: string): string {
  const safe = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${AVATAR_KEY_PREFIX}${Date.now()}-${safe}`;
}

async function signAvatarObjectKey(key: string): Promise<string> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}

async function uploadAvatarToS3AndFirestore(opts: {
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

// POST /avatars/upload ;upload avatar to S3 and append its key to config/shared.avatars
export async function uploadAvatar(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { key, url } = await uploadAvatarToS3AndFirestore({
      buffer: req.file.buffer,
      contentType: req.file.mimetype,
      originalFilename: req.file.originalname,
    });

    return res.status(201).json({ key, url });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload avatar";
    return res.status(500).json({ error: message });
  }
}

// GET /avatars ;read config/shared.avatars, return each key with a fresh signed URL
export async function getAllAvatars(req: Request, res: Response) {
  try {
    const snap = await db.doc("config/shared").get();
    const keys: string[] = snap.data()?.avatars ?? [];

    const avatars = await Promise.all(
      keys.map(async (key) => ({
        key,
        url: await signAvatarObjectKey(key),
      }))
    );

    return res.json(avatars);
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return res.status(500).json({ error: "Failed to fetch avatars" });
  }
}

// GET /avatars/signed-url?key=avatars/... ;refresh a signed URL for a single avatar
export async function getAvatarSignedUrl(req: Request, res: Response) {
  try {
    const key = req.query.key as string | undefined;

    if (!key) {
      return res.status(400).json({ error: "Missing required query parameter: key" });
    }

    const signedUrl = await signAvatarObjectKey(key);

    return res.json({ url: signedUrl, expiresIn: SIGNED_URL_EXPIRES_IN });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate signed URL";
    return res.status(500).json({ error: message });
  }
}
