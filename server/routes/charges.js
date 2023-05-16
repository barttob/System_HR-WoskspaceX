import express from "express";
import { getCharges, countCharges } from "../controllers/charges.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:sv_id", getCharges);
router.get("/", countCharges);

export default router;