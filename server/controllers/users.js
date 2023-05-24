import { db } from "../connect.js";
import bcrypt from "bcrypt";

export const getUsers = (req, res) => {
    const page = parseInt(req.params.site);
  
    db.query(
      "SELECT user_id, login, password, user_role FROM users LIMIT 50 OFFSET ?",
      [(page - 1) * 50],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send(result);
        }
      }
    );
};

export const countUsers = (req, res) => {
  db.query(
    "SELECT COUNT(user_id) AS user_count FROM users",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const getUserData = (req, res) => {
    const userId = req.params.userId;
  
    db.query(
      "SELECT login, password, first_name, last_name, user_role FROM users WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          if (result.length === 0) {
            res.status(404).send({ error: "User not found" });
          } else {
            const userData = result[0];
            res.send(userData);
          }
        }
      }
    );
};

export const updateUserLogin = (req, res) => {
    const userId = req.params.userId;
    const newLogin = req.body.login;
  
    db.query(
      "UPDATE users SET login = ? WHERE user_id = ?",
      [newLogin, userId],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send({ message: "Login updated successfully" });
        }
      }
    );
  };
  
  /*
  export const updateUserPassword = (req, res) => {
    const userId = req.params.userId;
    const newPassword = req.body.password;
  
    db.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [newPassword, userId],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send({ message: "Password updated successfully" });
        }
      }
    );
  };
  */

  export const updateUserPassword = (req, res) => {
    const userId = req.params.userId;
    const newPassword = req.body.password;
  
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
  
      db.query(
        "UPDATE users SET password = ? WHERE user_id = ?",
        [hashedPassword, userId],
        (err, result) => {
          if (err) {
            res.status(500).send({ error: err.message });
          } else {
            res.send({ message: "Hasło zostało zmienione" });
          }
        }
      );
    });
  };

  export const updateUserRole = (req, res) => {
    const userId = req.params.userId;
    const newRole = req.body.user_role;
  
    db.query(
      "UPDATE users SET user_role = ? WHERE user_id = ?",
      [newRole, userId],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send({ message: "Role updated successfully" });
        }
      }
    );
  };

