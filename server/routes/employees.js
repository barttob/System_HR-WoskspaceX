import express from "express";
import {
  getEmployees,
  countEmployees,
  getUser,
  addEmp,
  updateEmp,
  deleteEmp,
} from "../controllers/employees.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getEmployees);
router.get("/", countEmployees);
router.get("/info/:id", getUser);
router.post("/addEmp", addEmp);
router.post("/updateEmp", updateEmp);
router.post("/deleteEmp", deleteEmp);

export default router;
