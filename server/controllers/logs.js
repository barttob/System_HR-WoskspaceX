import { db } from "../connect.js";

export const getLogs = (req, res) => {
  db.query(
    "SELECT id, by_user, timestamp_log, action_type, log_details FROM workspacex_log",
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

export const countLogs = (req, res) => {
  db.query(
    "SELECT COUNT(id) AS log_count FROM workspacex_log",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};