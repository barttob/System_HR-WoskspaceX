const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/data", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

    console.log(login, ", ", password)
});

app.listen(3001, () => {
    console.log("Running on port 3001");
  });