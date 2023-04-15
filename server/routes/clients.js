import express from "express";
import { getClients, countClients, addClient } from "../controllers/clients.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getClients);
router.get("/", countClients);
router.post("/dodaj", addClient);

export default router;
