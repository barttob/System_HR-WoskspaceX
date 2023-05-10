import express from "express";
import { getSettlement, setSettle, generatePdf } from "../controllers/settlement.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getSettlement);
router.get("/gen/generate-pdf", generatePdf);
router.post("/settle", setSettle);


export default router;
