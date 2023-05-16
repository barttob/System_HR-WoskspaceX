import express from "express";
import { dodZwolnienie, getApplications } from "../controllers/schedule.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

//router.get("/:id", getEvents);
router.get("/:id", getApplications);
router.post("/zwolnienie", dodZwolnienie);


export default router;