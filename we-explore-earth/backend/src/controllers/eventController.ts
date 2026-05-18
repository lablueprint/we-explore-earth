import { db } from "../firestore";
import { Request, Response } from "express";
import type { DocumentData } from "firebase-admin/firestore";
import { FirestoreTimestamp, EventRSVP, Event, FirestoreEventData } from "@shared/types/event";
import { Filter } from "@shared/types/filter";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "../s3Client";

const EVENT_IMAGE_SIGNED_URL_EXPIRES_IN = 60 * 60;
const EVENT_IMAGE_PREFIX = "events/";

function buildEventImageObjectKey(originalFilename: string): string {
  const safe = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${EVENT_IMAGE_PREFIX}${Date.now()}-${safe}`;
}

async function uploadEventCoverToS3(opts: {
  buffer: Buffer;
  contentType: string;
  originalFilename: string;
}): Promise<{ key: string }> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }

  const key = buildEventImageObjectKey(opts.originalFilename);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: opts.buffer,
      ContentType: opts.contentType || "application/octet-stream",
    })
  );

  return { key };
}

async function signEventImageKey(key: string): Promise<string> {
  if (!bucketName) {
    throw new Error("S3 bucket not configured");
  }
  if (!key.startsWith(EVENT_IMAGE_PREFIX)) {
    throw new Error("Invalid event image key");
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: EVENT_IMAGE_SIGNED_URL_EXPIRES_IN,
  });
}

function firestoreTimestampToDate(ts: unknown): Date {
  if (ts == null || typeof ts !== "object") {
    return new Date(NaN);
  }
  const o = ts as {
    toDate?: () => Date;
    seconds?: unknown;
    _seconds?: unknown;
    nanoseconds?: unknown;
    _nanoseconds?: unknown;
  };
  if (typeof o.toDate === "function") {
    return o.toDate();
  }
  const secRaw = o._seconds ?? o.seconds;
  const nsecRaw = o._nanoseconds ?? o.nanoseconds ?? 0;
  const sec = typeof secRaw === "number" ? secRaw : NaN;
  const nsec = typeof nsecRaw === "number" ? nsecRaw : 0;
  if (!Number.isFinite(sec)) {
    return new Date(NaN);
  }
  return new Date(sec * 1000 + nsec / 1e6);
}

function toApiFirestoreTimestamp(ts: unknown): FirestoreTimestamp {
  const d = firestoreTimestampToDate(ts);
  const ms = d.getTime();
  if (!Number.isFinite(ms)) {
    return { _seconds: 0, _nanoseconds: 0 };
  }
  return {
    _seconds: Math.floor(ms / 1000),
    _nanoseconds: Math.round((ms % 1000) * 1e6),
  };
}

/** Multipart sends `category` / `accommodation` as JSON strings; JSON body may send arrays. */
function parseStringArrayField(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((x) => typeof x === "string") as string[];
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

function jsonResponseEvent(id: string, data: DocumentData) {
  return {
    id,
    ...data,
    timeStart: toApiFirestoreTimestamp(data.timeStart),
    timeEnd: toApiFirestoreTimestamp(data.timeEnd),
  };
}

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
      eventImage: bodyEventImage,
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

    const categoryArr = parseStringArrayField(category);
    const accommodationArr = parseStringArrayField(accommodation);

    let eventImageKey: string | null | undefined;
    if (req.file) {
      const { key } = await uploadEventCoverToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype || "image/jpeg",
        originalFilename: req.file.originalname || "cover.jpg",
      });
      eventImageKey = key;
    } else if (
      typeof bodyEventImage === "string" &&
      bodyEventImage.trim() !== ""
    ) {
      eventImageKey = bodyEventImage.trim();
    }

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      hostedBy,
      category: categoryArr,
      accommodation: accommodationArr,
      price: typeof price === "string" ? parseInt(price, 10) : price,
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : maxAttendees,
      attendees: [] as EventRSVP[],
    };

    if (eventImageKey != null) {
      eventData.eventImage = eventImageKey;
    }

    const docRef = await db.collection("events").add(eventData);
    const created = await docRef.get();
    const d = created.data()!;
    return res.status(201).json(jsonResponseEvent(docRef.id, d));
  } catch (error) {
    console.error("Error creating event:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create event";
    if (message.includes("S3 bucket not configured")) {
      return res.status(503).json({ error: message });
    }
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
    res.json(jsonResponseEvent(event.id, event.data()!));
  } catch (error) {
    console.error("Error fetching event: ", error);
    return res.status(500).json({ error: "Failed to fetch event" });
  }
}

// GET /events/signed-url?key=events/...
export async function getEventImageSignedUrl(req: Request, res: Response) {
  try {
    const key = req.query.key as string | undefined;

    if (!key) {
      return res.status(400).json({
        error: "Missing required query parameter: key",
      });
    }

    const signedUrl = await signEventImageKey(key);

    return res.json({
      url: signedUrl,
      expiresIn: EVENT_IMAGE_SIGNED_URL_EXPIRES_IN,
    });
  } catch (error) {
    console.error("Error generating event image signed URL:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate signed URL";
    return res.status(500).json({ error: message });
  }
}

export async function getAllEvents(req: Request, res: Response) {
  try {
    //get the snapshop
    const snapshot = await db.collection("events").get();

    //maps the docs into an array
    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return jsonResponseEvent(doc.id, data);
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
  try {
    // Grab all events from database
    const snapshot = await db.collection("events").get();

    // Grab filters from query parameters
    const filters: Filter = req.body;
    let filterStartDate: Date | undefined = undefined;
    let filterEndDate: Date | undefined = undefined;
    let filterCategories: Set<string> | undefined = undefined;
    let filterMaxEventPrice: number | undefined = undefined;
    let filterAccommodations: Set<string> | undefined = undefined;

    // Prepare the filters
    if (!filters.startDate && !filters.endDate) { // default case: no date range selected (aka: any date)
      filterStartDate = new Date(); // use exact current time so events are removed once their end time passes
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
    if (filters.maxEventPrice != undefined) {  // compared with undefined because maxEventPrice of 0 is falsy (0 == false)
      filterMaxEventPrice = filters.maxEventPrice;
    }
    if (filters.accommodations) {
      filterAccommodations = new Set(filters.accommodations);
    }
    // console.log(
    //   'Filters: \n',
    //   'Start date:      ' + filterStartDate + '\n', 
    //   'End date:        ' + filterEndDate + '\n',
    //   'Categories:      ', filterCategories +'\n',
    //   'Max event price: ', filterMaxEventPrice + '\n',
    //   'Accommodations:  ', filterAccommodations + '\n'
    // );

    // Filter events
    const events: Event[] = [];
    snapshot.docs.forEach((doc) => {
      const raw = doc.data();
      const event: Event = {
        id: doc.id,
        ...raw,
        timeStart: toApiFirestoreTimestamp(raw.timeStart),
        timeEnd: toApiFirestoreTimestamp(raw.timeEnd),
      } as Event;

      // Filtering
      // If default case (any date; no date range is selected), only include events that start on or after today
      // Only default case has a start date but no end date because all valid date ranges will have both start and end dates.
      if (filterStartDate && !filterEndDate) {
        const eventEndDate = firestoreTimestampToDate(raw.timeEnd);
        if (eventEndDate < filterStartDate) {
          return;
        }
      }
      // If a valid date range is selected (via date filter options or calendar picker)
      else if (filterStartDate && filterEndDate) {
        const eventStartDate = firestoreTimestampToDate(raw.timeStart);
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
      // If a max event price is set
      // compared with undefined because maxEventPrice of 0 is falsy (0 == false)
      if (filterMaxEventPrice != undefined && event.price > filterMaxEventPrice) {
        return;
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
      const eventStartDateA = firestoreTimestampToDate(a.timeStart);
      const eventStartDateB = firestoreTimestampToDate(b.timeStart);
      const eventEndDateA = firestoreTimestampToDate(a.timeEnd);
      const eventEndDateB = firestoreTimestampToDate(b.timeEnd);

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

    const eventRef = db.collection("events").doc(id as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existingData = eventDoc.data();
    const existingAttendees: EventRSVP[] = existingData?.attendees || [];

    const categoryArr = parseStringArrayField(category);
    const accommodationArr = parseStringArrayField(accommodation);

    const eventData: FirestoreEventData = {
      title,
      description,
      location,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      hostedBy,
      category: categoryArr,
      accommodation: accommodationArr,
      price: typeof price === "string" ? parseInt(price, 10) : price,
      maxAttendees:
        typeof maxAttendees === "string"
          ? parseInt(maxAttendees, 10)
          : maxAttendees,
      attendees: existingAttendees,
    };

    if (req.file) {
      const { key } = await uploadEventCoverToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype || "image/jpeg",
        originalFilename: req.file.originalname || "cover.jpg",
      });
      eventData.eventImage = key;
    } else if ("eventImage" in req.body) {
      const v = req.body.eventImage;
      if (v === null || v === "") {
        eventData.eventImage = null;
      } else if (typeof v === "string") {
        eventData.eventImage = v.trim() || null;
      }
    }

    await eventRef.update(eventData as any);

    const updated = await eventRef.get();
    return res.status(200).json(jsonResponseEvent(id as string, updated.data()!));
  } catch (error) {
    console.error("Error updating event:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update event";
    if (message.includes("S3 bucket not configured")) {
      return res.status(503).json({ error: message });
    }
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

export async function toggleCheckIn(req: Request, res: Response) {
  try {
    const eventId = req.params.id;
    const { userId, checkedIn } = req.body;

    if (!userId || checkedIn === undefined) {
      return res.status(400).json({ error: "userId and checkedIn are required" });
    }

    const eventRef = db.collection("events").doc(eventId as any);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventDoc.data()!;
    const attendees: EventRSVP[] = eventData.attendees.map((a: EventRSVP) => {
      if (a.userID === userId) {
        return {
          ...a,
          checkedIn,
        };
      }

      return a;
    });

    await eventRef.update({ attendees });

    return res.status(200).json({ message: "Check-in updated successfully" });
  } catch (error: any) {
    console.error("Error updating check-in:", error);
    return res.status(500).json({ error: "Failed to update check-in" });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const eventId = req.params.id as string;
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) return res.status(404).json({ error: "Event not found" });

    const attendees: EventRSVP[] = eventDoc.data()!.attendees ?? [];
    const baseUrl = `http://localhost:${process.env.PORT}`;

    await Promise.all(
      attendees.map(({ userID }) =>
        fetch(`${baseUrl}/users/${userID}/rsvp`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventID: eventId }),
        })
      )
    );

    await eventRef.delete();
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Failed to delete event" });
  }
}