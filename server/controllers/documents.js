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
  // console.log(req.file, req.body)
  const date = new Date();
  const now = date.toISOString().slice(0, 19).replace("T", " ");
  db.query(
    "INSERT INTO documents (user_id, document_type, document_name, add_date, exp_date, file_link, confirmation) VALUES (?,?,?,?,?,?,?)",
    [
      req.body.user_id,
      req.body.docType,
      req.file.originalname,
      now,
      req.body.exp_date,
      req.file.path,
      req.body.confirmation,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send({ success: true, result: result });
      }
    }
  );
};

export const downloadDoc = (req, res) => {
  db.query(
    "SELECT * FROM documents WHERE doc_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.download(result[0].file_link);
      }
    }
  );
};

export const getDocsConfirm = (req, res) => {
  db.query(
    "SELECT * FROM user_doc WHERE confirmation = 0",
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

export const confirmDoc = (req, res) => {
  db.query(
    "UPDATE documents SET confirmation = 1 WHERE doc_id = ?",
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

export const deleteDoc = (req, res) => {
  db.query(
    "DELETE FROM documents WHERE doc_id = ?",
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
