import { Router } from "express";
import {
  getAdmins,
  addAdmin,
  removeAdmin,
  getConfig
} from "../controllers/configController";

const router = Router();

router.get("/admins", getAdmins);
router.post("/admin", addAdmin);
router.delete("/admin", removeAdmin);
router.get("/", getConfig);

export default router;
