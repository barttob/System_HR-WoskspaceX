import express from "express";
import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";
//import passport from "passport";
//import initializePassport from "./passport.js";
import dbQuery from "./dbQuery.js";
//import LocalStrategy from "passport-local";
//import session from 'express-session';
import bcrypt from "bcrypt";

import employeesRoutes from "./routes/employees.js";
import documentsRoutes from "./routes/documents.js";
import clientsRoutes from "./routes/clients.js";
import jobsRoutes from "./routes/jobs.js";
import contractsRoutes from "./routes/contracts.js";
import supervisorRoutes from "./routes/supervisor.js";

const app = express();

app.use(cors());
app.use(express.json());

/*
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: false
}));

initializePassport(app);
passport.session();

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
*/

app.post('/pracownicy/dodaj', async (req, res) => {
  const { login, password, first_name, last_name, email } = req.body;

  //const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date) VALUES (?,?,?,?,?,'emp','1','1234-1234-1234','2009-09-15 16:49:30')`;
  //const values = [login, password, first_name, last_name, email];

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date, img_url) VALUES (?,?,?,?,?,'emp',DEFAULT,DEFAULT,DEFAULT, DEFAULT)`;
    const values = [login, hashedPassword, first_name, last_name, email];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
        res.send({ success: true });
    } else {
        //res.send({ success: false });
        res.status(401).send({ success: false, message: "Nie dodano pracownika do bazy" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  //const query = `SELECT * FROM users WHERE login=? AND password=?`;
  //const values = [login, password];

  try {
      const query = `SELECT * FROM users WHERE login=?`;
      const user = await dbQuery(query, [login]);

      if (user.length === 0) {
        return res.status(401).send({ success: false, message: "Nieprawidłowy login lub hasło" });
      }
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (isPasswordValid) {
        // Hasło jest poprawne
        res.send({ success: true, user: user[0] });
      } else {
          res.status(401).send({ success: false, message: "Nieprawidłowy login lub hasło." });
      }
  } catch (error) {
      res.status(500).send(error);
  }
});

app.post('/pracownicy/update', async (req, res) => {
  const { first_name, last_name, login, email, address_id, phone, birth_date } = req.body;

  try {
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, address_id = ?, phone = ?, birth_date = ? WHERE login = ?`;
    const values = [first_name, last_name, email, address_id, phone, birth_date, login];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
        res.send({ success: true });
    } else {
        res.status(401).send({ success: false, message: "Nie zaktualizowano danych pracownika" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/pracownicy/usun', async (req, res) => {
  const { first_name, last_name } = req.body;

  try {
    const query = `DELETE FROM users WHERE first_name = ? AND last_name = ?`;
    const values = [first_name, last_name];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
        res.send({ success: true });
    } else {
        res.status(401).send({ success: false, message: "Nie usunięto pracownika z bazy" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/pracownicy/contracts/addcontract', async (req, res) => {
  const { user_id, start_date, end_date, rate, user_role, contract_type } = req.body;

  //const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date) VALUES (?,?,?,?,?,'emp','1','1234-1234-1234','2009-09-15 16:49:30')`;
  //const values = [login, password, first_name, last_name, email];

  try {

    const query = `INSERT INTO contracts (user_id, start_date, end_date, rate, user_role, contract_type) VALUES (?,?,?,?,?,?)`;
    const values = [user_id, start_date, end_date, rate, user_role, contract_type];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
        res.send({ success: true });
    } else {
        //res.send({ success: false });
        res.status(401).send({ success: false, message: "Nie dodano kontraktu" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/pracownicy/supervisor', async (req, res) => {
  const { sv_id, user_id } = req.body;

  //const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date) VALUES (?,?,?,?,?,'emp','1','1234-1234-1234','2009-09-15 16:49:30')`;
  //const values = [login, password, first_name, last_name, email];

  try {

    const query = `INSERT INTO supervisor_assigment (sv_id, user_id) VALUES (?,?)`;
    const values = [sv_id, user_id];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
        res.send({ success: true });
    } else {
        //res.send({ success: false });
        res.status(401).send({ success: false, message: "Nie przypisano opiekuna" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use("/employees", employeesRoutes);
app.use("/documents", documentsRoutes);
app.use("/clients", clientsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/contracts", contractsRoutes);
app.use("/supervisor", supervisorRoutes);

app.listen(3001, () => {
  console.log("Running on port 3001");
  // createRandomAddress();
  // createRandomUser();
});
