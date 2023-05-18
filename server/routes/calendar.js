import express from "express";
import { getEvents, addEvent, getAllEvents } from "../controllers/calendar.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getEvents);
router.get("/get/allevents", getAllEvents);
router.post("/dodaj", addEvent);


export default router;
