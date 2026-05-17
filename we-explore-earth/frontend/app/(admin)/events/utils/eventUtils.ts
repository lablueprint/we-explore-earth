import type { Event, EventRSVP, FirestoreTimestamp } from "@shared/types/event";

// Helper function to combine date and time into a Date object
export const combineDateAndTime = (date: Date, time: Date): Date => {
  const combined = new Date(date);
  combined.setHours(time.getHours());
  combined.setMinutes(time.getMinutes());
  combined.setSeconds(time.getSeconds());
  combined.setMilliseconds(time.getMilliseconds());
  return combined;
};

// Convert FirestoreTimestamp to Date
// Handles FirestoreTimestamp format, ISO string, or Unix timestamp (seconds)
export const timestampToDate = (
  timestamp: FirestoreTimestamp | Date | string | number | null | undefined,
): Date => {
  if (!timestamp) {
    return new Date(); // Return current date as fallback
  }

  if (typeof timestamp === "number") {
    return new Date(timestamp > 1e12 ? timestamp : timestamp * 1000);
  }

  // If it's a FirestoreTimestamp object with _seconds
  if (
    typeof timestamp === "object" &&
    "_seconds" in timestamp &&
    typeof (timestamp as FirestoreTimestamp)._seconds === "number"
  ) {
    return new Date((timestamp as FirestoreTimestamp)._seconds * 1000);
  }

  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Try parsing as ISO string
  if (typeof timestamp === "string") {
    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Fallback to current date
  return new Date();
};

/** Normalize API JSON (GET/PUT) into an `Event` for client state. */
export function apiResponseToEvent(raw: Record<string, unknown>): Event | null {
  if (!raw || typeof raw.id !== "string") return null;

  const start = timestampToDate(
    raw.timeStart as FirestoreTimestamp | Date | string | number | null | undefined,
  );
  const end = timestampToDate(
    raw.timeEnd as FirestoreTimestamp | Date | string | number | null | undefined,
  );
  const timeStart: FirestoreTimestamp = {
    _seconds: Math.floor(start.getTime() / 1000),
    _nanoseconds: 0,
  };
  const timeEnd: FirestoreTimestamp = {
    _seconds: Math.floor(end.getTime() / 1000),
    _nanoseconds: 0,
  };

  const priceRaw = raw.price;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : parseInt(String(priceRaw ?? 0), 10);
  const maxRaw = raw.maxAttendees;
  const maxAttendees =
    typeof maxRaw === "number" ? maxRaw : parseInt(String(maxRaw ?? 0), 10);

  return {
    id: raw.id,
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    location: String(raw.location ?? ""),
    timeStart,
    timeEnd,
    category: Array.isArray(raw.category) ? (raw.category as string[]) : [],
    accommodation: Array.isArray(raw.accommodation)
      ? (raw.accommodation as string[])
      : [],
    price: Number.isFinite(price) ? price : 0,
    maxAttendees: Number.isFinite(maxAttendees) ? maxAttendees : 0,
    attendees: Array.isArray(raw.attendees)
      ? (raw.attendees as EventRSVP[])
      : [],
    hostedBy:
      raw.hostedBy != null && raw.hostedBy !== ""
        ? String(raw.hostedBy)
        : undefined,
    eventImage:
      raw.eventImage != null && raw.eventImage !== ""
        ? String(raw.eventImage)
        : undefined,
  };
}

/** Resolve stored S3 key (`events/…`) to a short-lived HTTPS URL for `<Image source={{ uri }} />`. */
export async function fetchEventCoverSignedUrl(
  key: string,
): Promise<string | null> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!baseUrl || !key.startsWith("events/")) {
    return null;
  }
  try {
    const res = await fetch(
      `${baseUrl}/events/signed-url?key=${encodeURIComponent(key)}`,
    );
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return typeof data.url === "string" ? data.url : null;
  } catch {
    return null;
  }
}
