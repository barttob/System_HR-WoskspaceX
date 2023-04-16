import express from "express";
import { getContracts, countContracts } from "../controllers/contracts.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getContracts);
router.get("/", countContracts);

export default router;