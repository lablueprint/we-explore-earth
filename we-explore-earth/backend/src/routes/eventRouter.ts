import express from "express";
import multer from "multer";
import {
  createEvent,
  getEvent,
  getAllEvents,
  getFilteredEvents,
  updateEvent,
  addOrUpdateRSVP,
  removeRSVP,
  getEventImageSignedUrl,
} from "../controllers/eventController";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// POST /events/create (optional multipart field `cover` for cover image → S3)
router.post("/create", upload.single("cover"), createEvent);

// POST /events/filtered (see note in eventController.ts)
router.post("/filtered", getFilteredEvents);

// PUT /events/:id (optional multipart field `cover`)
router.put("/:id", upload.single("cover"), updateEvent);

// GET /events/signed-url?key=events/... — same pattern as GET /users/avatars/signed-url
router.get("/signed-url", getEventImageSignedUrl);

// GET /events/:id
router.get("/:id", getEvent);

// GET /events/
router.get("/", getAllEvents);

// POST /events/:id/rsvp
router.post("/:id/rsvp", addOrUpdateRSVP);

// DELETE /events/:id/rsvp
router.delete("/:id/rsvp", removeRSVP);

export default router;
