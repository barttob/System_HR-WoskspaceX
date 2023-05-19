import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdatePracownika.css";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";

const UpdatePracownika = () => {
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [address_id, setAddressId] = useState("");
  const [phone, setPhone] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const sendUpdateData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/employees/updateEmp",
        {
          login: login,
          first_name: first_name,
          last_name: last_name,
          email: email,
          address_id: address_id,
          phone: phone,
          birth_date: birth_date,
        }
      );

      if (response) {
        toast.success(`Zaktualizowano dane!`);
        navigate(-1);
      } else {
        toast.error("Nie zaktualizowano danych. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Coś poszło nie tak.");
      console.log(error);
    }
  };

  return (
    <div className="update">
      <div className="update__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="updateprac__window__inputs">
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
            type="address_id"
            placeholder="Nr adresu"
            onChange={(e) => {
              setAddressId(e.target.value);
            }}
          />
          <input
            type="phone"
            placeholder="Nr telefonu"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <input
            type="birth_date"
            placeholder="Data urodzenia"
            onChange={(e) => {
              setBirthDate(e.target.value);
            }}
          />
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">Pomyślnie zaktualizowano dane</div>
          )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendUpdateData}>Aktualizuj dane</button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePracownika;
