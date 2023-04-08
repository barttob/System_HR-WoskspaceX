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
  const date = new Date();
  const now = date.toISOString().slice(0, 19).replace('T', ' ');
  db.query(
    "INSERT INTO documents (user_id, document_type, document_name, add_date, exp_date, file_link) VALUES (?,?,?,?,?,?)",
    [req.body.user_id, req.body.docType, req.file.originalname, now, req.body.exp_date, req.file.path],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send({ success: true, result: result});
      }
    }
  );
};
