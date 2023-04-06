import { db } from "../connect.js";

export const getDocuments = (req, res) => {
  db.query(
    "SELECT * FROM docmuents WHERE user_id = ?",
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