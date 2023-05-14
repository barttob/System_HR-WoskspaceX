import express from "express";
import { getApplications, countApplications, handleApproval } from "../controllers/applications.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getApplications);
router.get("/", countApplications);
router.patch("/:app_id", handleApproval);

export default router;