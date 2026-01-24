import express from "express";
import { createEvent, getEvent, getEvents } from "../controllers/eventController";

const router = express.Router();

// POST /events/create
router.post("/create", createEvent);

// GET /events
router.get("/", getEvents);

// GET /events/:id
router.get("/:id", getEvent);

// POST /events
router.post("/", createEvent);


export default router;