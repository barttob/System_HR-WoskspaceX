import express from "express";
const app = express();
import cors from "cors";
import { createRandomUser, createRandomAddress } from "./controllers/fillDB.js";

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  console.log(login, ", ", password);
});

app.listen(3001, () => {
  console.log("Running on port 3001");
  // createRandomAddress();
  // createRandomUser();
});
