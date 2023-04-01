import mysql from "mysql2";

/*
export const connectToDatabase = async () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "workspacex",
  });

  return new Promise((resolve, reject) => {j
    connection.connect((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
};
*/

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "workspacex",
});

export const connectToDatabase = async () => {
  const connection = mysql.createConnection(db);
  return new Promise((resolve, reject) => {
    connection.connect((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
};

//export default connectToDatabase
export default connectToDatabase