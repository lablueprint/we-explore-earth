import { db } from "../firestore";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { FirestoreEventData, EventRSVP } from "@shared/types/event";

// create event
export async function createEvent(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      location,
      timeStart,
      timeEnd,
      price,
      maxAttendees,
      rsvpDeadline,
      hostedBy,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !timeStart ||
      !timeEnd ||
      price == null ||
      !maxAttendees ||
      !rsvpDeadline ||
      !hostedBy ||
      !tags
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      category: tags.category || [],
      accommodation: tags.accommodation || [],
      price: typeof price === "string" ? parseInt(price, 10) : price,
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : maxAttendees,
      attendees: [] as EventRSVP[],
    };

    const docRef = await db.collection("events").add(eventData);

    return res.status(201).json({ id: docRef.id, ...eventData });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Failed to create event" });
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    const event = await db.collection("events").doc(req.params.id as string).get(); // did 'as string' to avoid type error on mannys system.
    if (!event.exists){
      return res.status(404).json({error: "Event not found"});
    }
    res.json({ id: event.id, ...event.data() });
  } catch (error) {
    console.error("Error fetching event: ", error);
    return res.status(500).json({ error: "Failed to fetch event" });
  }
}

export async function getAllEvents(req: Request, res: Response) {
  try {
    //get the snapshop
    const snapshot = await db.collection("events").get();

    //maps the docs into an array
    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data, // '...' merges into one object
      };
    });

    //send data back
    console.log(`Fetched ${events.length} events successfully`);
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    return res
      .status(500)
      .json({ error: "failed to fetch events from database" });
  }
}

// update event
export async function updateEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      timeStart,
      timeEnd,
      price,
      maxAttendees,
      rsvpDeadline,
      hostedBy,
      tags,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !timeStart ||
      !timeEnd ||
      price == null ||
      !maxAttendees ||
      !rsvpDeadline ||
      !hostedBy ||
      !tags
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if event exists
    const eventRef = db.collection("events").doc(id as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      price: typeof price === "string" ? parseInt(price, 10) : price,
      category: tags.category || [],
      accommodation: tags.accommodation || [],
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : maxAttendees,
      attendees: [] as EventRSVP[],
    };

    await eventRef.update(eventData as any);

    return res.status(200).json({ id, ...eventData });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Failed to update event" });
  }
}

export async function addOrUpdateRSVP(req: Request, res: Response) {
  try {
    const eventId = req.params.id;
    const { userID, status } = req.body;

    if (!userID || !status) {
      return res.status(400).json({ error: "userID and status are required" });
    }

    if (status !== 'YES' && status !== 'MAYBE') {
      return res.status(400).json({ error: "status must be 'YES' or 'MAYBE'" });
    }

    const eventRef = db.collection("events").doc(eventId as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data()!;
    const attendees: EventRSVP[] = eventData.attendees || [];
    const existingAttendeeIndex = attendees.findIndex((a) => a.userID === userID);
    if (existingAttendeeIndex >= 0) {
      attendees[existingAttendeeIndex].status = status;
    } else {
      const newRSVP: EventRSVP = { userID, status, checkedIn: false };
      attendees.push(newRSVP);
    }

    await eventRef.update({ attendees });

    return res.status(200).json({ message: "Event RSVP updated successfully" });
  } catch (error: any) {
    console.error("Error updating event RSVP:", error);
    return res.status(500).json({ error: "Failed to update event RSVP" });
  }
}

export async function removeRSVP(req: Request, res: Response) {
  try {
    const eventId = req.params.id;
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json({ error: "userID is required" });
    }

    const eventRef = db.collection("events").doc(eventId as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data()!;
    const attendees: EventRSVP[] = (eventData.attendees || []).filter(
      (a: EventRSVP) => a.userID !== userID
    );

    await eventRef.update({ attendees });

    return res.status(200).json({ message: "Event RSVP removed successfully" });
  } catch (error: any) {
    console.error("Error removing event RSVP:", error);
    return res.status(500).json({ error: "Failed to remove event RSVP" });
  }
}
