import { db } from "../connect.js";

export const getEmployees = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE user_role = 'emp' LIMIT 50 OFFSET ?",
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

export const countEmployees = (req, res) => {
  db.query(
    "SELECT COUNT(user_id) AS user_count FROM users WHERE user_role = 'emp'",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const getUser = (req, res) => {
  db.query(
    "SELECT * FROM user_address WHERE user_id = ?",
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
