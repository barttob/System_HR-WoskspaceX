import { db } from "../connect.js";

export const getContracts = (req, res) => {
  db.query(
    "SELECT * FROM contracts WHERE user_role = 'emp' LIMIT 50 OFFSET ?",
    [(req.params.site - 1) * 50],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const countContracts = (req, res) => {
  db.query(
    "SELECT COUNT(contract_id) AS contract_count FROM contracts WHERE user_role = 'emp'",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};
