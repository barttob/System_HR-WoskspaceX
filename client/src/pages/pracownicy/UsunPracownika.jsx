import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UsunPracownika.css";
import BackButton from "../../components/backButton/BackButton";

const UsunPracownika = () => {
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [isLogged, setIsLogged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [deletedFirstName, setDeletedFirstName] = useState("");
  const [deletedLastName, setDeletedLastName] = useState("");

  //const navigate = useNavigate();

  const sendDeleteData = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/pracownicy/usun",
        {
          first_name: first_name,
          last_name: last_name,
        }
      );

      if (response.data.success) {
        setShowSuccessMessage(true);
        setDeletedFirstName(first_name);
        setDeletedLastName(last_name);
      } else {
        setErrorMessage("Nie usunięto pracownika. Spróbuj ponownie.");
      }
    } catch (error) {
      setErrorMessage("Coś poszło nie tak.");
      console.log(error);
    }
  };

  return (
    <div className="delete">
      <div className="delete__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="usunprac__window__inputs">
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
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">Pomyślnie usunięto pracownika: {deletedFirstName} {deletedLastName}</div>
          )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendDeleteData}>Usuń pracownika</button>
        </div>
      </div>
    </div>
  );
};

export default UsunPracownika;
