import { db } from "../connect.js";
/*
export const getEvents = (req, res) => {
  db.query(
    "SELECT * FROM calendar WHERE user_id = ?",
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
*/

export const getApplications = (req, res) => {
  db.query(
    "SELECT c.event_name, c.event_desc, c.event_date_start, c.event_date_end, a.app_type, a.app_desc, a.from_date, a.to_date FROM emp_applications AS a LEFT JOIN calendar AS c ON c.user_id = a.user_id WHERE a.user_id = ? AND a.approved = TRUE",
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


export const dodZwolnienie = (req, res) => {
  db.query(
    "INSERT INTO emp_applications (app_type, from_date, to_date, app_desc, user_id) VALUES (?,?,?,?,?)",
    [
      req.body.appInputs.app_type,
      req.body.fromDate,
      req.body.toDate,
      req.body.appInputs.app_desc,
      req.body.appInputs.user_id,
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
