import { db } from "../connect.js";

export const getDocuments = (req, res) => {
  db.query(
    "SELECT * FROM documents WHERE user_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const addDocument = (req, res) => {
  console.log(req.file, req.body)
  db.query(
    "INSERT INTO documents (user_id, document_type, document_name, add_date, exp_date, file_link) VALUES (?,?,?,'2009-09-15 16:49:30','2009-09-15 16:49:30',?)",
    [req.body.user_id, req.body.docType, req.file.originalname, req.file.path],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send({ success: true, result: result});
      }
    }
  );
};
