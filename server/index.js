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
