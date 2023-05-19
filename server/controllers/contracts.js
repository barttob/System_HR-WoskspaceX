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

export const addContract = (req, res) => {
  const { user_id, rate, contract_type } = req.body.inputs;
  const { dateFormat, dateEndFormat } = req.body;

  try {
    const query = `INSERT INTO contracts (user_id, start_date, end_date, rate, contract_type) VALUES (?,?,?,?,?)`;
    const values = [user_id, dateFormat, dateEndFormat, rate, contract_type];

    db.query(query, values, (err, result) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
