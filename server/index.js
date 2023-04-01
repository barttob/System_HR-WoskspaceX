import session from 'express-session';
import passport from './passport.js';
import express from "express";
import connectToDatabase from "./connect.js";

const app = express();

import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*app.post("/login", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  console.log(login, ", ", password);
});
*/

//Utworzenie routy do logowania
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Pomyślnie zalogowano");
});

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("Brak autentykacji");
  }
});

//obsluga wylogowania
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
  });

app.listen(3001, async () => {
  try {
    const db = await connectToDatabase();
    console.log("Connected to database!");
  } catch (error) {
    console.error(error);
  }
  console.log("Running on port 3001");
  // createRandomAddress();
  // createRandomUser();
});
