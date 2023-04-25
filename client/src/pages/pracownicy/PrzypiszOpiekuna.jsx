import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PrzypiszOpiekuna.css";
import BackButton from "../../components/backButton/BackButton";

const PrzypiszOpiekuna = () => {
  const [sv_id, setSv_Id] = useState("");
  const [user_id, setUser_Id] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  //const navigate = useNavigate();

  const sendSvAssignData = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/pracownicy/supervisor/assignsv",
        {
          sv_id: sv_id,
          user_id: user_id,
        }
      );

      if (response.data.success) {
        setShowSuccessMessage(true);
      } else {
        setErrorMessage("Nie przypisano opiekuna. Sprawdź poprawność id.");
      }
    } catch (error) {
      setErrorMessage("Coś poszło nie tak. Sprawdź poprawność id.");
      console.log(error);
    }
  };

  return (
    <div className="svassign">
      <div className="svassign__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="svassign__window__inputs">
          <input
            type="text"
            placeholder="Id opiekuna"
            onChange={(e) => {
              setSv_Id(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Id pracownika"
            onChange={(e) => {
              setUser_Id(e.target.value);
            }}
          />
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">Pomyślnie przypisano opiekuna pracownikowi</div>
          )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendSvAssignData}>Przypisz opiekuna</button>
        </div>
      </div>
    </div>
  );
};

export default PrzypiszOpiekuna;