import { Request, Response } from "express";
import twilio from "twilio";

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