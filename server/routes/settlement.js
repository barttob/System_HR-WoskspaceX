import express from "express";
import { getSettlement } from "../controllers/settlement.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getSettlement);

export default router;
