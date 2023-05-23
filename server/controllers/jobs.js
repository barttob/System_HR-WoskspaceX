import { db } from "../connect.js";

export const getJobs = (req, res) => {
  db.query(
    "SELECT *, (SELECT first_name FROM clients WHERE clients.client_id = jobs.client_id LIMIT 1) AS client_first, (SELECT last_name FROM clients WHERE clients.client_id = jobs.client_id LIMIT 1) AS client_last FROM jobs WHERE status = 'active' OR start_date > NOW() ORDER BY start_date ASC LIMIT 50 OFFSET ?",
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

export const getJob = (req, res) => {
  db.query(
    "SELECT * FROM jobs WHERE job_id = ?",
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

export const countJobs = (req, res) => {
  db.query(
    "SELECT COUNT(job_id) AS job_count FROM jobs WHERE status = 'active'",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const addJob = (req, res) => {
  db.query(
    "INSERT INTO jobs (name, description, emp_quantity, start_date, end_date, client_id, status) VALUES (?,?,?,?,?,?,?)",
    [
      req.body.jobInputs.name,
      req.body.jobInputs.desc,
      req.body.jobInputs.emp_quantity,
      req.body.start_date,
      req.body.end_date,
      req.body.clientId,
      "active",
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
      } else {
        db.query(
          "INSERT INTO `job_schedule` VALUES (DEFAULT,?,'00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00')",
          [result.insertId],
          (err, result) => {
            if (err) {
              res.status(500).send({ error: err.message });
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  );
};

// INSERT INTO `job_schedule` VALUES (2,'00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00','00:00:00')

export const addEmp = (req, res) => {
  db.query(
    "INSERT INTO jobs_assigment (job_id, user_id, add_date, contract_id) VALUES (?,(SELECT user_id FROM users WHERE first_name = ? AND last_name = ? LIMIT 1),NOW(),(SELECT contract_id FROM contracts WHERE user_id = (SELECT user_id FROM users WHERE first_name = ? AND last_name = ? LIMIT 1) ORDER BY start_date DESC LIMIT 1))",
    [
      req.body.job_id,
      req.body.first_name,
      req.body.last_name,
      req.body.first_name,
      req.body.last_name,
    ],
    (err, result) => {
      if (err.errno == 1048) {
        res.status(401).send({ error: "Pracownik nie ma kontraktu" });
      } else if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const getEmps = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE users.user_id IN (SELECT user_id FROM jobs_assigment WHERE job_id = ?)",
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
