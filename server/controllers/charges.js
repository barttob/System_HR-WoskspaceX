import { db } from "../connect.js";

export const getCharges = (req, res) => {
    db.query(
      "SELECT u.user_id AS 'id opiekuna', sa.user_id AS 'id podopiecznego', u.first_name AS 'imie opiekuna', u.last_name AS 'nazwisko opiekuna', su.first_name AS 'imie podopiecznego', su.last_name AS 'nazwisko podopiecznego',a.address_id,a.start_date,a.end_date FROM users u JOIN supervisor_assigment sa ON u.user_id = sa.sv_id JOIN users su ON sa.user_id = su.user_id LEFT JOIN accomodation a ON a.user_id = su.user_id WHERE u.user_role = 'sv' AND su.user_role = 'emp' AND sa.sv_id = 125 ORDER BY u.user_id ASC;",
      [req.params.sv_id],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send(result);
        }
      }
    );
};
  
  export const countCharges = (req, res) => {
    db.query(
      "SELECT COUNT(user_id) AS user_count FROM supervisor_assigment WHERE sv_id = ? ",
      [req.params.sv_id],
      (err, result) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.send(result);
        }
      }
    );
};

export const getFlats = (req, res) => {
  const page = parseInt(req.params.site);
  db.query(
    "SELECT address_id, address1, address2, city, country, postal_code FROM address LIMIT 50 OFFSET ?",
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

export const countFlats = (req, res) => {
  db.query(
    "SELECT COUNT(address_id) AS address_count FROM address ",
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(result);
      }
    }
  );
};

export const przypMieszkanie = (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    "INSERT INTO accomodation (acc_id, user_id, address_id, start_date, end_date, sv_id) VALUES (DEFAULT,?,?,?,?,?)",
    [
      user_id,
      req.body.appInputs.address_id,
      req.body.start_date,
      req.body.end_date,
      req.body.sv_id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.send(result);
      }
    }
  );
};

export const usunzMieszkania = (req, res) => {
  const user_id = req.params.podopiecznyId;
  db.query(
    "DELETE FROM accomodation WHERE user_id = ?",
    [user_id,],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        if (result.affectedRows === 0) {
          res.send({ message: "Pracownik już jest usunięty z mieszkania." });
        } else {
          res.send({ message: "Pracownik został pomyślnie usunięty z mieszkania." });
        }
      }
    }
  );
};

export const pokaInfo = (req, res) => {
  const user_id = req.params.userId;
  db.query(
    "SELECT u.first_name, u.last_name, u.email, u.phone, u.birth_date, a.address1, a.address2, a.postal_code, a.city, a.country FROM users u LEFT JOIN accomodation ac ON u.user_id = ac.user_id LEFT JOIN address a ON ac.address_id = a.address_id WHERE u.user_id = ?",
    //"SELECT first_name, last_name, email, phone, birth_date FROM users WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        res.send(result);
      }
    }
  );
};