import express from "express";
import { getContracts, countContracts, getContract } from "../controllers/contracts.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getContracts);
router.get("/", countContracts);
router.get("/info/:id", getContract);

export default router;