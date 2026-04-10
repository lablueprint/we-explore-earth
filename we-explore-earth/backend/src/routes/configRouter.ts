import { Router } from "express";
import {
  getAdmins,
  addAdmin,
  removeAdmin,
  getCategories,
  getAccommodations,
} from "../controllers/configController";

const router = Router();

router.get("/admins", getAdmins);
router.post("/admin", addAdmin);
router.delete("/admin", removeAdmin);

router.get("/categories", getCategories);
router.get("/accommodations", getAccommodations);

export default router;
