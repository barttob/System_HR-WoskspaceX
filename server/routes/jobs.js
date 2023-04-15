import express from "express";
import { addJob, getJobs, countJobs, getJob } from "../controllers/jobs.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getJobs);
router.get("/", countJobs);
router.get("/job/:id", getJob);
router.post("/dodaj", addJob);

export default router;
