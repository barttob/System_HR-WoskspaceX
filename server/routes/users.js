import express from "express";
import { getUsers, countUsers, getUserData, updateUserLogin, updateUserPassword, updateUserRole } from "../controllers/users.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:site", getUsers);
router.get("/", countUsers);
router.get("/userdata/:userId", getUserData);
router.put("/userdata/:userId", updateUserLogin);
router.post("/userdata/:userId", updateUserPassword);
router.patch("/userdata/:userId", updateUserRole);

export default router;