import { db } from "../firestore";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { FirestoreTimestamp, RSVPStatus, EventRSVP, Event, FirestoreEventData } from "@shared/types/event";
import { Filter } from "@shared/types/filter";

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
      hostedBy,
      category,
      accommodation,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !timeStart ||
      !timeEnd ||
      price == null ||
      !maxAttendees ||
      !hostedBy
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      hostedBy,
      category: (category ?? []) as string[],
      accommodation: (accommodation ?? []) as string[],
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
    const event = await db
      .collection("events")
      .doc(req.params.id as string)
      .get(); // did 'as string' to avoid type error on mannys system.
    if (!event.exists) {
      return res.status(404).json({ error: "Event not found" });
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

/**
 * POST /events/filtered - get and filter events for home page
 * 
 * Note:
 * - Using POST instead of GET to allow query parameters (filters) to scale.
 * - If filters grows large, we may exceed url length when adding filters as query parameters to API endpoint.
 */
export async function getFilteredEvents(req: Request, res: Response) {
  // Helper function for converting an event's startTime and endTime to Date objects
  const convertFirestoreTimestampToDate = (timestamp: FirestoreTimestamp): Date => {
    const milliseconds = (timestamp._seconds * 1000) + (timestamp._nanoseconds / 1000000);
    return new Date(milliseconds);
  };

  try {
    // Grab all events from database
    const snapshot = await db.collection("events").get();

    // Grab filters from query parameters
    const filters: Filter = req.body;
    let filterStartDate: Date | undefined = undefined;
    let filterEndDate: Date | undefined = undefined;
    let filterCategories: Set<string> | undefined = undefined;
    let filterAccommodations: Set<string> | undefined = undefined;

    // Prepare the filters
    if (!filters.startDate && !filters.startDate) { // default case: no date range selected
      filterStartDate = new Date(); // set start date to current date
      filterStartDate.setHours(0, 0, 0, 0); // normalize start date
    }
    else if (filters.startDate && filters.endDate) { // valid date range selected
      filterStartDate = new Date(filters.startDate);
      filterEndDate = new Date(filters.endDate);
      // redundant but for fallback reasons: normalize dates since we are comparing dates not timestamps
      filterStartDate.setHours(0, 0, 0, 0);
      filterEndDate.setHours(0, 0, 0, 0);
    }
    if (filters.categories) {
      filterCategories = new Set(filters.categories);
    }
    if (filters.accommodations) {
      filterAccommodations = new Set(filters.accommodations);
    }
    // console.log('Filters: \n', 'Start date:     ' + filterStartDate + '\n', 'End date:       ' + filterEndDate + '\n', 'Categories:    ', filterCategories, '\n', 'Accommodations:', filterAccommodations, '\n');

    // Filter events
    const events: Event[] = [];
    snapshot.docs.forEach((doc) => {
      // Mapping
      const event: Event = {
        id: doc.id,
        ...doc.data()
      } as Event;

      // Filtering
      // If default case (no date range is selected), only include events that start on or after today
      // Only default case has a start date but no end date because all valid date ranges will have both start and end dates.
      if (filterStartDate && !filterEndDate) {
        const eventStartDate = convertFirestoreTimestampToDate(event.timeStart)
        eventStartDate.setHours(0, 0, 0, 0); // normalize event's start date
        // only compare event's start date with selected date range; ignore event's end date
        if (eventStartDate < filterStartDate) {
          return;
        }
      }
      // If a valid date range is selected (via date filter options or calendar picker)
      else if (filterStartDate && filterEndDate) {
        const eventStartDate = convertFirestoreTimestampToDate(event.timeStart);
        eventStartDate.setHours(0, 0, 0, 0); // normalize event's start date
        if (eventStartDate < filterStartDate || filterEndDate < eventStartDate) {
          return;
        }
      }
      // If at least 1 category filter is selected
      if (filterCategories) {
        let containsCategory: Boolean = false;
        const eventCategories = event.category;
        for(let i=0; i<eventCategories.length; i++) {
          if (filterCategories.has(eventCategories[i])) {
            containsCategory = true;
            break;
          }
        }
        if (!containsCategory) {
          return;
        }
      }
      // If at least 1 accommodation is selected
      if (filterAccommodations) {
        let containsAccommodation: Boolean = false;
        const eventAccommodations = event.accommodation;
        for(let i=0; i<eventAccommodations.length; i++) {
          if (filterAccommodations.has(eventAccommodations[i])) {
            containsAccommodation = true;
            break;
          }
        }
        if (!containsAccommodation) {
          return;
        }
      }
      events.push(event);
    });

    // Sort filtered events
    events.sort((a: Event, b: Event) => {
      // derive start and end dates
      const eventStartDateA = convertFirestoreTimestampToDate(a.timeStart);
      const eventStartDateB = convertFirestoreTimestampToDate(b.timeStart);
      const eventEndDateA = convertFirestoreTimestampToDate(a.timeEnd);
      const eventEndDateB = convertFirestoreTimestampToDate(b.timeEnd);

      // 1. Sort by start date (ascending).
      // 2. If start dates are the same, sort by end date (ascending).
      // 3. If end dates are the same, sort by title (alphabetical).
      return (eventStartDateA.getTime() - eventStartDateB.getTime()) || 
             (eventEndDateA.getTime() - eventEndDateB.getTime()) || 
             a.title.localeCompare(b.title);
    })
    
    console.log(`Fetched ${events.length} filtered events successfully.`);
    res.status(200).json(events);
  }
  catch (error: any) {
    console.log("Error in getFilteredEvents:", error);
    res.status(500).json({error: "Failed to fetch filtered events from database."});
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
      hostedBy,
      category,
      accommodation,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !timeStart ||
      !timeEnd ||
      price == null ||
      !maxAttendees ||
      !hostedBy
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if event exists
    const eventRef = db.collection("events").doc(id as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existingData = eventDoc.data();
    const existingAttendees: EventRSVP[] = existingData?.attendees || [];

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      hostedBy,
      category: (category ?? []) as string[],
      accommodation: (accommodation ?? []) as string[],
      price: typeof price === "string" ? parseInt(price, 10) : price,
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : maxAttendees,
      attendees: existingAttendees,
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

    if (status !== "YES" && status !== "MAYBE") {
      return res.status(400).json({ error: "status must be 'YES' or 'MAYBE'" });
    }

    const eventRef = db.collection("events").doc(eventId as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data()!;
    const attendees: EventRSVP[] = eventData.attendees.filter((a: EventRSVP) => a.userID !== userID);
    attendees.push({ userID, status, checkedIn: false });

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
    const attendees: EventRSVP[] = eventData.attendees.filter(
      (a: EventRSVP) => a.userID !== userID
    );

    await eventRef.update({ attendees });

    return res.status(200).json({ message: "Event RSVP removed successfully" });
  } catch (error: any) {
    console.error("Error removing event RSVP:", error);
    return res.status(500).json({ error: "Failed to remove event RSVP" });
  }
}
