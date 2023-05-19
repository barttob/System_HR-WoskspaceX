import { db } from "../connect.js";

export const getSv = (req, res) => {
  db.query(
    "SELECT u_emp.user_id AS 'id pracownika', u_emp.first_name AS 'imie pracownika', u_emp.last_name AS 'nazwisko pracownika', s.sv_id AS 'id opiekuna', u_sv.first_name AS 'imie opiekuna', u_sv.last_name AS 'nazwisko opiekuna' FROM supervisor_assigment s JOIN users u_emp ON s.user_id = u_emp.user_id AND u_emp.user_role = 'emp' JOIN users u_sv ON s.sv_id = u_sv.user_id AND u_sv.user_role = 'sv'",
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

export const countSv = (req, res) => {
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

export const assignSv = (req, res) => {
  const { sv_id, user_id } = req.body;

  try {
    const query = `INSERT INTO supervisor_assigment (sv_id, user_id) VALUES (?,?)`;
    const values = [sv_id, user_id];

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