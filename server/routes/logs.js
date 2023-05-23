import express from "express";
import { getLogs, countLogs} from "../controllers/logs.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getLogs);
router.get("/", countLogs);

export default router;