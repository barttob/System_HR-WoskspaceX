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
  console.log(req.body.emp_id);
  db.query(
    "INSERT INTO jobs_assigment (job_id, user_id, add_date, contract_id) VALUES (?,?,NOW(),(SELECT contract_id FROM contracts WHERE user_id = ?))",
    [req.body.job_id, req.body.emp_id, req.body.emp_id],
    (err, result) => {
      if (result) {
        res.send(result);
      } else if (err.errno == 1048) {
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

export const searchEmps = (req, res) => {
  db.query(
    "SELECT * FROM users WHERE (CONCAT(first_name, ' ', last_name) LIKE ?) OR (CONCAT(last_name, ' ', first_name) LIKE ?) LIMIT 100",
    [req.query.search.concat("%"), req.query.search.concat("%")],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const endJob = (req, res) => {
  db.query(
    "UPDATE jobs SET status = 'finished' WHERE job_id = ?",
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
