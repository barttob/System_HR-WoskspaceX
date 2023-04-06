import express from "express";
import { getEmployees, countEmployees } from "../controllers/employees.js";

const router = express.Router();

router.get("/:site", getEmployees);
router.get("/", countEmployees);

export default router;
