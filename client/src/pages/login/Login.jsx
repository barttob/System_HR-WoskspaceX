import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const navigate = useNavigate();

  const sendLoginData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      console.log(response);

      if (response) {
        setShowSuccessMessage(true);
        setCurrentUser(response.data.user);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      } else {
        setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
      }
    } catch (error) {
      setErrorMessage("Niepoprawny login lub hasło. Spróbuj ponownie.");
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
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Hasło"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="message">
            {showSuccessMessage
              ? "Zalogowano poprawnie. Witamy!"
              : errorMessage}
          </div>
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendLoginData}>Zaloguj się</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
