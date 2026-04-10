import express from "express";
import multer from "multer";
import { uploadAvatar, getAllAvatars, getAvatarSignedUrl } from "../controllers/avatarController";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// GET /avatars ;all avatar options with signed URLs
router.get("/", getAllAvatars);

// GET /avatars/signed-url?key=avatars/...
router.get("/signed-url", getAvatarSignedUrl);

// POST /avatars/upload ;upload a new avatar image
router.post("/upload", upload.single("file"), uploadAvatar);

export default router;
