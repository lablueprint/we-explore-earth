import { db } from "../firestore";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { Event } from "../types/event";

// GET /users/:id
export async function createEvent(req: Request, res: Response) {
  try {
    const { title, description, location, timeStart, timeEnd } = req.body;

    if (!title || !description || !location || !timeStart || !timeEnd) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const eventData: Event = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
    };

    const docRef = await db.collection("events").add(eventData);

    return res.status(201).json({ id: docRef.id, ...eventData });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Failed to create event" });
  }
}

export async function getEvent (req: Request, res: Response) {
  try {
    const event = await db.collection("events").doc(req.params.id).get();
    if (!event.exists){
      return res.status(404).json({error: "Event not found"});
    }
    res.json({id: event.id, ...event.data()})
  }
  catch(error){
    console.error("Error fetching event: ", error);
    return res.status(500).json({error: "Failed to fetch event" });
  }
}

export async function getEvents(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("events").orderBy("timeStart", "asc").get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
}