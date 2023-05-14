import { db } from "../connect.js";

export const getApplications = (req, res) => {
  db.query(
    "SELECT emp_applications.app_id, emp_applications.app_type AS 'typ wniosku', emp_applications.from_date AS 'od dnia', emp_applications.to_date AS 'do dnia', emp_applications.app_desc AS 'opis', emp_applications.user_id AS 'id pracownika', users.first_name AS 'imie pracownika', users.last_name AS 'nazwisko pracownika', emp_applications.approved FROM emp_applications JOIN users ON emp_applications.user_id = users.user_id;",
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

export const handleApproval = (req, res) => {
    const app_id= req.params.app_id;

    db.query(
      "UPDATE emp_applications SET approved = TRUE WHERE app_id = ?",
      [app_id],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send({ message: "Rekord został pomyslnie zatwierdzony." });
        }
      }
    );
};

export const countApplications = (req, res) => {
  db.query(
    "SELECT COUNT(app_id) AS app_count FROM emp_applications",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};