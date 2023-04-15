import { db } from "../connect.js";

export const getClients = (req, res) => {
  db.query(
    "SELECT * FROM clients LIMIT 10 OFFSET ?",
    [(req.params.site - 1) * 10],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const countClients = (req, res) => {
  db.query(
    "SELECT COUNT(client_id) AS client_count FROM clients",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const addClient = (req, res) => {
  db.query(
    "INSERT INTO clients (first_name, last_name, email, phone) VALUES (?,?,?,?)",
    [
      req.body.clientInputs.first_name,
      req.body.clientInputs.last_name,
      req.body.clientInputs.phone,
      req.body.clientInputs.email,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};
