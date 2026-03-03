import { FirestoreTimestamp } from "@shared/types/event";

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
// Handles FirestoreTimestamp format or ISO string format
export const timestampToDate = (
  timestamp: FirestoreTimestamp | Date | string | null | undefined
): Date => {
  if (!timestamp) {
    return new Date(); // Return current date as fallback
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
