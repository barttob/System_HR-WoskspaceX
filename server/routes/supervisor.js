import express from "express";
import { getSv, countSv } from "../controllers/supervisor.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getSv);
router.get("/", countSv);

export default router;