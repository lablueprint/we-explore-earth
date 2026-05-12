import express from "express";
import multer from "multer";
import { uploadFile, getUploadSignedUrl } from "../controllers/uploadController";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// GET /uploads/signed-url?key=uploads/
router.get("/signed-url", getUploadSignedUrl);

// POST /uploads ;single file
router.post("/", upload.single("file"), uploadFile);

export default router;
