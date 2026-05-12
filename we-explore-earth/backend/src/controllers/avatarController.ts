import { Request, Response } from "express";
import { db } from "../firestore";
import {
  uploadAvatarToS3AndFirestore,
  signAvatarObjectKey,
} from "../services/avatarUploadService";

const SIGNED_URL_EXPIRES_IN = 60 * 60;

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
