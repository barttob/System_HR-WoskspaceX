import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [isLogged, setIsLogged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const sendLoginData = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/login", {
        login: login,
        password: password,
      });
  
      if (response.data.success) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
      }
    } catch (error) {
      setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
      console.log(error);
    }
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
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">Zalogowano poprawnie. Witamy!</div>
            )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendLoginData}>Zaloguj się</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
