import express from "express";
import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";
import dbQuery from "./dbQuery.js";
import bcrypt from "bcrypt";

import employeesRoutes from "./routes/employees.js";
import documentsRoutes from "./routes/documents.js";
import clientsRoutes from "./routes/clients.js";
import jobsRoutes from "./routes/jobs.js";
import contractsRoutes from "./routes/contracts.js";
import supervisorRoutes from "./routes/supervisor.js";
import calendarRoutes from "./routes/calendar.js";
import scheduleRoutes from "./routes/schedule.js";
import settlementRoutes from "./routes/settlement.js";
import applicationsRoutes from "./routes/applications.js";
import chargesRoutes from "./routes/charges.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/pracownicy/dodaj", async (req, res) => {
  const { login, password, first_name, last_name, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (login, password, first_name, last_name, email, user_role, address_id, phone, birth_date, img_url) VALUES (?,?,?,?,?,'emp',DEFAULT,DEFAULT,DEFAULT, DEFAULT)`;
    const values = [login, hashedPassword, first_name, last_name, email];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
      res.send({ success: true });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Nie dodano pracownika do bazy" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const query = `SELECT * FROM users WHERE login=?`;
    const user = await dbQuery(query, [login]);

    if (user.length === 0) {
      return res
        .status(401)
        .send({ success: false, message: "Nieprawidłowy login lub hasło" });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (isPasswordValid) {
      res.send({ success: true, user: user[0] });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Nieprawidłowy login lub hasło." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pracownicy/update", async (req, res) => {
  const { first_name, last_name, login, email, address_id, phone, birth_date } =
    req.body;

  try {
    const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, address_id = ?, phone = ?, birth_date = ? WHERE login = ?`;
    const values = [
      first_name,
      last_name,
      email,
      address_id,
      phone,
      birth_date,
      login,
    ];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
      res.send({ success: true });
    } else {
      res.status(401).send({
        success: false,
        message: "Nie zaktualizowano danych pracownika",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pracownicy/usun", async (req, res) => {
  const {id, first_name, last_name } = req.body;

  try {
    const query = `DELETE FROM users WHERE user_id = ? AND first_name = ? AND last_name = ?`;
    const values = [id, first_name, last_name];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
      res.send({ success: true });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Nie usunięto pracownika z bazy" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pracownicy/contracts/addcontract", async (req, res) => {
  const { user_id, rate, contract_type } = req.body.inputs;
  const { dateFormat, dateEndFormat } = req.body;

  try {
    const query = `INSERT INTO contracts (user_id, start_date, end_date, rate, contract_type) VALUES (?,?,?,?,?)`;
    const values = [
      user_id,
      dateFormat,
      dateEndFormat,
      rate,
      contract_type,
    ];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
      res.send({ success: true });
    } else {
      res.status(401).send({ success: false, message: "Nie dodano kontraktu" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pracownicy/supervisor/assignsv", async (req, res) => {
  const { sv_id, user_id } = req.body;

  try {
    const query = `INSERT INTO supervisor_assigment (sv_id, user_id) VALUES (?,?)`;
    const values = [sv_id, user_id];

    const results = await dbQuery(query, values);
    if (results.affectedRows > 0) {
      res.send({ success: true });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Nie przypisano opiekuna" });
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
app.use("/calendar", calendarRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/settlement", settlementRoutes);
app.use("/applications", applicationsRoutes);
app.use("/charges", chargesRoutes);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
