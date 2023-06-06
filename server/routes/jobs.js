import express from "express";
import {
  addJob,
  getJobs,
  countJobs,
  getJob,
  addEmp,
  getEmps,
  endJob,
  searchEmps,
} from "../controllers/jobs.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getJobs);
router.get("/", countJobs);
router.get("/job/:id", getJob);
router.get("/search/emps", searchEmps);
router.post("/dodaj", addJob);
router.post("/emp/dodaj", addEmp);
router.post("/endjob/:id", endJob);
router.get("/:id/emps", getEmps);

export default router;
