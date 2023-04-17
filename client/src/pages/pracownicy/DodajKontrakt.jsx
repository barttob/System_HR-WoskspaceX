import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DodajKontrakt.css";
import BackButton from "../../components/backButton/BackButton";
import { Link } from "react-router-dom";

/*
import { useState, useEffect } from "react";
import axios from "axios";
import "./Kontrakty.css";
import { Link } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
*/

const DodajKontrakt = () => {
  const [user_id, setUser_Id] = useState("");
  const [start_date, setStart_Date] = useState("");
  const [end_date, setEnd_Date] = useState("");
  const [rate, setRate] = useState("");
  const [user_role, setUser_Role] = useState("");
  const [contract_type, setContract_Type] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  //const [isLogged, setIsLogged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  //const navigate = useNavigate();

  const sendContractData = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/pracownicy/contracts/addcontract",
        {
          user_id: user_id,
          start_date: start_date,
          end_date: end_date,
          rate: rate,
          user_role: user_role,
          contract_type: contract_type,
        }
      );

      if (response.data.success) {
        setShowSuccessMessage(true);
      } else {
        setErrorMessage("Nie dodano kontraktu. Spróbuj ponownie.");
      }
    } catch (error) {
      setErrorMessage("Coś poszło nie tak.");
      console.log(error);
    }
  };

  return (
    <div className="contract">
      <div className="contract__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="contract__window__inputs">
        <input
            type="text"
            placeholder="Id pracownika"
            onChange={(e) => {
              setUser_Id(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Początek umowy (yyyy-mm-dd)"
            onChange={(e) => {
              setStart_Date(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Koniec umowy (yyyy-mm-dd)"
            onChange={(e) => {
              setEnd_Date(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Stawka ($)"
            onChange={(e) => {
              setRate(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Rola"
            onChange={(e) => {
              setUser_Role(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Typ umowy (Perm/Fixed/Temp)"
            onChange={(e) => {
              setContract_Type(e.target.value);
            }}
          />
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">Pomyślnie dodano kontrakt</div>
          )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendContractData}>Zatwierdź kontrakt</button>
        </div>
      </div>
    </div>
  );
};

export default DodajKontrakt;
