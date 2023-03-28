import React from "react";
import { useState } from "react";
import Axios from "axios";

import "./Login.css";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const sendData = () => {
    Axios.post("http://localhost:3001/data", {
      login: login,
      password: password,
    })
  };

  return (
    <div className="login">
      <div className="login__window">
        <div className="logo__window__header">
          <img src="logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="logo__window__inputs">
          <input
            type="text"
            placeholder="Login"
            onChange={(e) => {
              setLogin(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Hasło"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendData}>Zaloguj się</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
