import React from "react";
import { useState } from "react";
import axios from "axios";
import "./DodajPracownika.css";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DodajPracownika = () => {
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const sendRegisterData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/employees/addEmp",
        {
          login: login,
          password: password,
          first_name: first_name,
          last_name: last_name,
          email: email,
        }
      );

      if (response) {
        toast.success("Pomyślnie dodano pracownika");
        navigate(-1);
      } else {
        toast.error("Nie dodano pracownika. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Coś poszło nie tak.");
      console.log(error);
    }
  };

  return (
    <div className="register">
      <div className="register__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="dodajprac__window__inputs">
          <input
            type="text"
            placeholder="Imię"
            onChange={(e) => {
              setFirst_Name(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Nazwisko"
            onChange={(e) => {
              setLast_Name(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
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
          <button onClick={sendRegisterData}>Zarejestruj</button>
        </div>
      </div>
    </div>
  );
};

export default DodajPracownika;
