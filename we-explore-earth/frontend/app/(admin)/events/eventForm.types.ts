/** React state for admin create/edit screens (pickers use Date + string fields). */
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
  /** S3 key `events/…`; display via GET /events/signed-url */
  eventImage: string | null;
}
