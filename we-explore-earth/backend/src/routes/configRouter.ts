import { Router } from "express";
import {
  getAdmins,
  addAdmin,
  removeAdmin,
  getEventOptions,
} from "../controllers/configController";

const router = Router();

router.get("/admins", getAdmins);
router.post("/admin", addAdmin);
router.delete("/admin", removeAdmin);

router.get("/event-options", getEventOptions);

export default router;
