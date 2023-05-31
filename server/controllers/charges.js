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