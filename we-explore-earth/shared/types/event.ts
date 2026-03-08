// We have to make our own firestore timestamp because /shared/types doesn't have firebase node modules local to it
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type RSVPStatus = "YES" | "MAYBE";

//THIS HERE SHOULD BE ALL YOU NEED BUT IF NOT RUN IT BY PLs TO DOUBLE CHECK
//CONSOLDATE EVERYTHING TO
// EventRSVP
// NewEvent
// Event (which should extend from NewEvent)

export interface EventRSVP {
  userID: string;
  status: RSVPStatus;
  checkedIn: boolean;
}

// Event interface for reading from Firestore (uses FirestoreTimestamp)
export interface Event {
id: string;
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
/** Stored when creating/updating; may be missing on older events */
hostedBy?: string;
}

/** Form state for event create/edit UI. Uses split date/time and string inputs for pickers. */
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
  imageUri: string | null;
}

/** Event with user's RSVP status (e.g. from GET /users/:id/events) */
export type EventWithStatus = Event & { status?: RSVPStatus };

// Event data for writing to Firestore (uses Date - Firestore converts to FirestoreTimestamp)
export interface FirestoreEventData {
  title: string;
  description: string;
  location: string;
  timeStart: Date;
  timeEnd: Date;
  price: number;
  maxAttendees: number;
  hostedBy: string;
  category: string[];
  accommodation: string[];
  attendees?: EventRSVP[];
}
