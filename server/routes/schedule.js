import express from "express";
import { dodZwolnienie, getApplications, addSchedule, getJobSchedule, getUserJobSchedule } from "../controllers/schedule.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

//router.get("/:id", getEvents);
router.get("/:id", getApplications);
router.post("/zwolnienie", dodZwolnienie);
router.post("/addschedule/:id", addSchedule);
router.get("/jobschedule/:id", getJobSchedule);
router.get("/userjobschedule/:id", getUserJobSchedule);


export default router;