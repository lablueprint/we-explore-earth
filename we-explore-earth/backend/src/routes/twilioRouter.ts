import { Router } from "express";
import { sendEventBlastSMS, sendSMS } from "../controllers/twilioController";

const router = Router();

router.post("/send-sms", sendSMS); 
router.post("/event-blast", sendEventBlastSMS);

export default router;