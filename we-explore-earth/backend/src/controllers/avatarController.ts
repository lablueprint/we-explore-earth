import { s3Client, bucketName } from "../s3Client";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request, Response } from "express";
import admin from "firebase-admin";

const db = admin.firestore();
const SIGNED_URL_EXPIRES_IN = 60 * 60;

async function generateSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}

// POST /avatars/upload ;upload avatar to S3 and append its key to config/shared.avatars
export async function uploadAvatar(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    if (!bucketName) {
      return res.status(500).json({ error: "S3 bucket not configured" });
    }

    const originalName = req.file.originalname;
    const key = `avatars/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    await db.doc("config/shared").update({
      avatars: admin.firestore.FieldValue.arrayUnion(key),
    });

    const url = await generateSignedUrl(key);

    return res.status(201).json({ key, url });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ error: "Failed to upload avatar" });
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
        url: await generateSignedUrl(key),
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

    if (!bucketName) {
      return res.status(500).json({ error: "S3 bucket not configured" });
    }

    const signedUrl = await generateSignedUrl(key);

    return res.json({ url: signedUrl, expiresIn: SIGNED_URL_EXPIRES_IN });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
