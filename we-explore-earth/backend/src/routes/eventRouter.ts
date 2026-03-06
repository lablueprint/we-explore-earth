import express from "express";
import {
  createEvent,
  getEvent,
  getAllEvents,
  getFilteredEvents,
  updateEvent,
  addOrUpdateRSVP,
  removeRSVP,
} from "../controllers/eventController";

const router = express.Router();

// POST /events/create
router.post("/create", createEvent);

// POST /events/filtered (see note in eventController.ts)
router.post("/filtered", getFilteredEvents);

// PUT /events/:id
router.put("/:id", updateEvent);

// GET /events/:id
router.get("/:id", getEvent);

// GET /events/
router.get("/", getAllEvents);

// POST /events/:id/rsvp
router.post("/:id/rsvp", addOrUpdateRSVP);

// DELETE /events/:id/rsvp
router.delete("/:id/rsvp", removeRSVP);

export default router;
