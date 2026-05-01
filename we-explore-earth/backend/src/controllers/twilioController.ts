import { Request, Response } from "express";
import twilio from "twilio";
import { db } from "../firestore";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);

export const sendSMS = async (req: Request, res: Response) => {
  const { to, body } = req.body;

    try {
        const result = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to
        });
        res.status(200).json({ success: true, message: "SMS sent successfully", sid: result.sid });
    } catch (error) {
        console.error("Error sending SMS:", error);
        res.status(500).json({ success: false, message: "Failed to send SMS" });
    }
}

export const sendEventBlastSMS = async (req: Request, res: Response) => {
  try {
    const { eventID } = req.body;

    if (!eventID) {
      return res.status(400).json({ error: "eventID is required" });
    }

    const eventDoc = await db.collection("events").doc(eventID).get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendees = (eventDoc.data()?.attendees ?? []) as { userID: string }[];
    const userIDs = attendees.map((attendee) => attendee.userID);

    const userDocs = await Promise.all(
      userIDs.map((userID) => db.collection("users").doc(userID).get())
    );

    const emails = userDocs.map((userDoc) => userDoc.data()?.email);

    console.log("Event ID:", eventID);
    emails.forEach((email) => console.log("User email:", email));

    return res.status(200).json({
      eventID,
      emails,
    });
  } catch (error) {
    console.error("Error sending event blast SMS:", error);
    return res
      .status(500)
      .json({ error: "Failed to gather event blast recipients" });
  }
};
