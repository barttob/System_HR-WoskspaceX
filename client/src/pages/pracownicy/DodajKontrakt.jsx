import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DodajKontrakt.css";
import BackButton from "../../components/backButton/BackButton";
import { Link, useLocation } from "react-router-dom";
import DatePicker from "react-date-picker";

const DodajKontrakt = () => {
  const [start_date, setStart_Date] = useState(new Date());
  const [end_date, setEnd_Date] = useState(new Date());
  const [contract_type, setContract_Type] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const [emptyType, setEmptyType] = useState(null);

  const location = useLocation();
  const { id } = location.state;

  const [inputs, setInputs] = useState({
    user_id: id,
    rate: "-1",
    contract_type: "-",
    user_role: "",
  });

  const handleChange = (e) => {
    setInputs((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (
      inputs.contract_type == "Umowa zlecenie" ||
      inputs.contract_type == "Umowa o dzieło"
    ) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        rate: "-1",
      }));
    }
  }, [inputs.contract_type]);

  const sendContractData = async () => {
    if (inputs.contract_type == "-") {
      setEmptyType("empty");
    } else {
      try {
        let dateFormat = new Date(
          start_date.getTime() - start_date.getTimezoneOffset() * 60000
        );
        dateFormat = dateFormat.toISOString().slice(0, 19).replace("T", " ");
        let dateEndFormat = new Date(
          end_date.getTime() - end_date.getTimezoneOffset() * 60000
        );
        dateEndFormat = dateEndFormat
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const response = await Axios.post(
          "http://localhost:3001/pracownicy/contracts/addcontract",
          {
            inputs,
            dateFormat,
            dateEndFormat,
          }
        );

        if (response.data.success) {
          setShowSuccessMessage(true);
          navigate(-1);
        } else {
          setErrorMessage("Nie dodano kontraktu. Spróbuj ponownie.");
        }
      } catch (error) {
        setErrorMessage("Coś poszło nie tak.");
        console.log(error);
      }
    }
  };

  return (
    <div className="kalendarz">
      <div className="kalendarzAdd__header">
        <BackButton />
        Dodaj kontrakt
      </div>
      <div className="kalendarzAdd__wrapper">
        <div className="kalendarzAdd__content">
          <div className="kalendarzAdd__form">
            <form className="kalendarzAdd__form__inputs">
              <div>
                <select name="contract_type" onChange={handleChange}>
                  <option value="-">-</option>
                  <option value="Umowa o pracę tymczasową">
                    Umowa o pracę tymczasową
                  </option>
                  <option value="Umowa o pracę na czas określony">
                    Umowa o pracę na czas określony
                  </option>
                  <option value="Umowa zlecenie">Umowa zlecenie</option>
                  <option value="Umowa o dzieło">Umowa o dzieło</option>
                </select>
                {inputs.contract_type == "Umowa o pracę tymczasową" && (
                  <input
                    type="text"
                    placeholder="Stawka godzinowa brutto"
                    name="rate"
                    onChange={handleChange}
                    maxLength="10"
                  />
                )}
                {inputs.contract_type == "Umowa o pracę na czas określony" && (
                  <input
                    type="text"
                    placeholder="Pensja brutto"
                    name="rate"
                    onChange={handleChange}
                    maxLength="10"
                  />
                )}
              </div>
              <div className="kalendarzAdd__form__inputs__date">
                <div className="kalendarzAdd__form__inputs__date--label">
                  Start kontraktu:{" "}
                </div>
                <DatePicker
                  onChange={setStart_Date}
                  value={start_date}
                  clearIcon={null}
                />
              </div>
              <div className="kalendarzAdd__form__inputs__date">
                <div className="kalendarzAdd__form__inputs__date--label">
                  Koniec kontraktu:{" "}
                </div>
                <DatePicker
                  onChange={setEnd_Date}
                  value={end_date}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="pracaAdd__form__inputs pracaAdd__submit">
          <input type="submit" onClick={sendContractData} value="Dodaj" />
        </div>
        <div>{emptyType == "empty" && "Wybierz typ kontraktu"}</div>
      </div>
    </div>
  );
};

export default DodajKontrakt;
