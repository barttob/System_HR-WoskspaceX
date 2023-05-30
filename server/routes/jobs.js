import express from "express";
import { addJob, getJobs, countJobs, getJob, addEmp, getEmps, endJob } from "../controllers/jobs.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getJobs);
router.get("/", countJobs);
router.get("/job/:id", getJob);
router.post("/dodaj", addJob);
router.post("/emp/dodaj", addEmp);
router.post("/endjob/:id", endJob);
router.get("/:id/emps", getEmps);

export default router;
