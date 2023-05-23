import express from "express";
import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";

import passport from "passport";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import path from "path";
import helmet from "helmet";
import hpp from "hpp";
import dotenv from "dotenv";


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
import logsRoutes from "./routes/logs.js";

import authRoutes from "./routes/auth.js";

dotenv.config({ path: path.resolve(".env") });
console.log();

const app = express();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(helmet());
app.use(hpp());


const sessionStore = MySQLStore(session);
const sessionOptions = {
  name: "workspacex-session",
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new sessionStore({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "workspacex",
  }),
  cookie: {
    // expires: new Date(Date.now() + 60 * 1000),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

app.use(express.static("public"));
app.use(session(sessionOptions));
app.use(passport.authenticate("session"));

app.use(passport.initialize());


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
app.use("/logs", logsRoutes);

app.use("/auth", authRoutes);

app.listen(3001, () => {
  console.log("Running on port 3001");
});
