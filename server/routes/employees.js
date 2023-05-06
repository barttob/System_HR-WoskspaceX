import express from "express";
import { getEmployees, countEmployees, getUser } from "../controllers/employees.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getEmployees);
router.get("/", countEmployees);
router.get("/info/:id", getUser);

export default router;
