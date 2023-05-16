import { db } from "../connect.js";

export const getContracts = (req, res) => {
  db.query(
    //"SELECT * FROM contracts WHERE user_role = 'emp' LIMIT 50 OFFSET ?",
    "SELECT contract_id, user_id, start_date, end_date, rate, user_role, contract_type FROM contracts LIMIT 50",
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
    "SELECT COUNT(contract_id) AS contract_count FROM contracts",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const getContract = (req, res) => {
  db.query(
    "SELECT * FROM contracts WHERE user_id = ? ORDER BY end_date DESC",
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
