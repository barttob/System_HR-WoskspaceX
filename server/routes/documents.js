import express from "express";
import { getDocuments } from "../controllers/documents.js";

const router = express.Router()

router.get("/:id", getDocuments)

export default router
