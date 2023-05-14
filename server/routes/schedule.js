import express from "express";
import { getEvents, dodZwolnienie } from "../controllers/schedule.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getEvents);
router.post("/zwolnienie", dodZwolnienie);


export default router;