import express from "express";
import { getDocuments, addDocument } from "../controllers/documents.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "documents/");
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const date = Date.now();
    const newFilename = `${date}-${originalname}`;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/:id", getDocuments);
router.post("/upload", upload.single("fileSubmit"), addDocument);

export default router;
