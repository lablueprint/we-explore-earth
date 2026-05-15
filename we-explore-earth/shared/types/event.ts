// Plain Firestore timestamp shape (no firebase SDK in /shared)
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type RSVPStatus = "YES" | "MAYBE";

/** One row in an event’s `attendees` array (Firestore). */
export interface EventRSVP {
  userID: string;
  status: RSVPStatus;
  checkedIn: boolean;
}

/** Event document as stored / returned by the API (Firestore field types). */
export interface NewEvent {
  title: string;
  description: string;
  location: string;
  timeStart: FirestoreTimestamp;
  timeEnd: FirestoreTimestamp;
  category: string[];
  accommodation: string[];
  price: number;
  maxAttendees: number;
  attendees: EventRSVP[];
  hostedBy?: string;
  /** S3 object key `events/…` */
  eventImage?: string | null;
}

export interface Event extends NewEvent {
  id: string;
}

/** `GET /users/:id/events` adds the current user’s RSVP on the event. */
export type EventWithStatus = Event & { status?: RSVPStatus };

/** Body the backend writes with `Date` (Firestore converts to timestamps). */
export type FirestoreEventData = Omit<
  NewEvent,
  "timeStart" | "timeEnd" | "attendees"
> & {
  timeStart: Date;
  timeEnd: Date;
  attendees?: EventRSVP[];
};

/**
 * Admin create/edit event screen state (date pickers + text fields).
 * Differs from `Event` / Firestore shape (`timeStart`/`timeEnd` are split for UI).
 */
export interface EventFormState {
  title: string;
  description: string;
  dateStart: Date;
  timeStart: Date;
  dateEnd: Date;
  timeEnd: Date;
  location: string;
  price: string;
  hostedBy: string;
  category: string[];
  accommodation: string[];
  maxAttendees: string;
  /**
   * In form state this is either:
   *  - an S3 object key (`events/…`) for an existing image, resolved to a
   *    signed URL via `useEventSignedImageUrl` for display, OR
   *  - a local URI (`file://…`, `content://…`) from a fresh image picker
   *    selection, which gets uploaded as multipart on submit.
   * `null` when there is no cover image.
   */
  eventImage: string | null;
}
