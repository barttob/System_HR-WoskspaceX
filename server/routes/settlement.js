import express from "express";
import { getSettlement, setSettle } from "../controllers/settlement.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getSettlement);
router.post("/settle", setSettle);

export default router;
