import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "workspacex",
});

export default db
/*
export const getUserByLogin = async (login, password) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE login = ? AND password = ?";
    db.query(query, [login, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error("User not found"));
        }
      }
    });
  });
};
*/