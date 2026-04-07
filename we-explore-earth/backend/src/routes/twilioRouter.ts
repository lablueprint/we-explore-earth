import { Router } from "express";
import { sendSMS } from "../controllers/twilioController";

const router = Router();

router.post("/send-sms", sendSMS); 

export default router;