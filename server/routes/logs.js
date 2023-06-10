import express from "express";
import { getLogs, countLogs, deleteLog} from "../controllers/logs.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getLogs);
router.get("/", countLogs);
router.delete("/:id", deleteLog);

export default router;