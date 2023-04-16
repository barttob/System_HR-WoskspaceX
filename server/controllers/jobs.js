import { db } from "../connect.js";

export const getJobs = (req, res) => {
  db.query(
    "SELECT *, (SELECT first_name FROM clients WHERE clients.client_id = jobs.client_id LIMIT 1) AS client_first, (SELECT last_name FROM clients WHERE clients.client_id = jobs.client_id LIMIT 1) AS client_last FROM jobs WHERE status = 'active' LIMIT 50 OFFSET ?",
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
  // console.log(req.body.clientId);
  const date = new Date();
  const now = date.toISOString().slice(0, 19).replace("T", " ");
  db.query(
    "INSERT INTO jobs (name, description, emp_quantity, emp_rate, add_date, end_date, client_id, status) VALUES (?,?,?,?,?,?,?,?)",
    [
      req.body.jobInputs.name,
      req.body.jobInputs.desc,
      req.body.jobInputs.emp_quantity,
      req.body.jobInputs.emp_rate,
      now,
      req.body.end_date,
      req.body.clientId,
      "active",
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

export const addEmp = (req, res) => {
  db.query(
    "INSERT INTO jobs_assigment (job_id, user_id) VALUES (?,?)",
    [req.body.job_id, req.body.emp_id],
    (err, result) => {
      if (err) {
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
