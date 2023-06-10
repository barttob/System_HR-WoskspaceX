import { db } from "../connect.js";

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

export const getAllEvents = (req, res) => {
  db.query("SELECT * FROM calendar", (err, result) => {
    if (err) {
      res.status(500).send({ error: err.message });
    } else {
      res.send(result);
    }
  });
};

export const addEvent = (req, res) => {
  db.query(
    "INSERT INTO calendar (user_id, event_date_start, event_date_end, event_name, event_desc) VALUES (?,?,?,?,?)",
    [
      req.body.empAddId,
      req.body.dateFormat,
      req.body.dateEndFormat,
      req.body.eventInputs.event_name,
      req.body.eventInputs.event_desc,
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
