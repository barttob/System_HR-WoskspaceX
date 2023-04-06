import express from "express";
import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";
//import passport from "passport";
//import initializePassport from "./passport.js";
import dbQuery from "./dbQuery.js";
//import LocalStrategy from "passport-local";
//import session from 'express-session';

import employeesRoutes from "./routes/employees.js";
import documentsRoutes from "./routes/documents.js";

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

app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const query = `SELECT * FROM users WHERE login=? AND password=?`;
  const values = [login, password];

  try {
      const results = await dbQuery(query, values);
      if (results.length > 0) {
          res.send({ success: true });
      } else {
          //res.send({ success: false });
          res.status(401).send({ success: false, message: "Nieprawidłowy login lub hasło." });
      }
  } catch (error) {
      res.status(500).send(error);
  }
});

app.use("/employees", employeesRoutes);
app.use("/documents", documentsRoutes);

app.listen(3001, () => {
  console.log("Running on port 3001");
  // createRandomAddress();
  // createRandomUser();
});
