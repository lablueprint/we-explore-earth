import express from "express";
import { createEvent, getAllEvents, getEvent } from "../controllers/eventController";

const router = express.Router();

// POST /events/create
router.post("/create", createEvent);

// GET /events/:id
router.get("/:id", getEvent);

// GET /events
router.get("/", getAllEvents);

export default router;