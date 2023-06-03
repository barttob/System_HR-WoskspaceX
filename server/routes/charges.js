import express from "express";
import { getCharges, countCharges, getFlats, countFlats, przypMieszkanie , usunzMieszkania, pokaInfo} from "../controllers/charges.js";
import { aclAuth } from "../controllers/aclAuth.js";

const router = express.Router();

router.get("/:sv_id", getCharges);
router.get("/", countCharges);
router.get("/mieszkania/:site", getFlats);
router.get("/mieszkania", countFlats);
router.post("/mieszkania/:user_id", przypMieszkanie);
router.delete("/:podopiecznyId", usunzMieszkania);
router.get("/info/:userId", pokaInfo);


export default router;