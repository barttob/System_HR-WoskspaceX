import { db } from "../connect.js";
import bcrypt from "bcrypt";

export const getEmployees = (req, res) => {
  const first_name = req.query.first_name.concat("%");
  const last_name = req.query.last_name.concat("%");
  db.query(
    "SELECT * FROM users WHERE user_role = 'emp' AND first_name LIKE ? AND last_name LIKE ? LIMIT 50 OFFSET ?",
    [first_name, last_name, (req.params.site - 1) * 50],
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
  const first_name = req.query.first_name.concat("%");
  const last_name = req.query.last_name.concat("%");
  db.query(
    "SELECT COUNT(user_id) AS user_count FROM users WHERE user_role = 'emp' AND first_name LIKE ? AND last_name LIKE ?",
    [first_name, last_name],
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
    "SELECT *, (SELECT first_name FROM users WHERE user_id = (SELECT sv_id FROM supervisor_assigment WHERE user_id = ?)) AS sv_name, (SELECT last_name FROM users WHERE user_id = (SELECT sv_id FROM supervisor_assigment WHERE user_id = ?)) AS sv_last FROM user_address WHERE user_id = ?",
    [req.params.id, req.params.id, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.send(result);
      }
    }
  );
};

export const addEmp = async (req, res) => {
  const { login, password, first_name, last_name, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date, img_url) VALUES (?,?,?,?,?,'emp',101,'500500500',NOW(),'test')`;
    const values = [login, hashedPassword, first_name, last_name, email];

    const results = db.query(query, values, (err, result) => {
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

export const updateEmp = async (req, res) => {
  const { first_name, last_name, login, email, address_id, phone, birth_date } =
    req.body;

  try {
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, address_id = ?, phone = ?, birth_date = NOW() WHERE login = ?`;
    const values = [
      first_name,
      last_name,
      email,
      address_id,
      phone,
      birth_date,
      login,
    ];

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

export const deleteEmp = async (req, res) => {
  const { id, first_name, last_name } = req.body;

  try {
    const query = `DELETE FROM users WHERE user_id = ? AND first_name = ? AND last_name = ?`;
    const values = [id, first_name, last_name];

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
