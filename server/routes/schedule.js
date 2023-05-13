import express from "express";
import { getEvents, addEvent } from "../controllers/schedule.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getEvents);
//router.post("/dodaj", addEvent);


export default router;