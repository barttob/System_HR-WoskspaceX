import express from "express";
import { getSettlement, setSettle, generatePdf, getSalaries } from "../controllers/settlement.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:id", getSettlement);
router.get("/gen/generate-pdf", generatePdf);
router.get("/salaries/:id", getSalaries);
router.post("/settle", setSettle);


export default router;
