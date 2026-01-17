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

export async function getAllEvents(req: Request, res: Response) {
  try {
    const data = await db.collection("events").get();
    const allEvents : Array<Event> = [];
    data.forEach((doc) => {
      if(!doc.exists){
        return res.status(404).json({ error: "Event not found" });
      }
      allEvents.push({id: doc.id, ...doc.data()} as Event);
    })
    return res.json(allEvents);
  }
  catch (error: any) {
    console.error("Error fetching all events for home page.", error.message);
    return res.status(500).json({error: `Error fetching all events for home page. ${error.message}`});
  }
}