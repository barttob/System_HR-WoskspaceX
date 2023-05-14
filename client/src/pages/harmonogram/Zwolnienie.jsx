import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Zwolnienie.css";
import BackButton from "../../components/backButton/BackButton";
import DateTimePicker from "react-datetime-picker";

import "./DateTimePicker.css";

const Zwolnienie = () => {
	//const [dateValue, setDateValue] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
	const [fromDateValue, setFromDateValue] = useState(new Date());
	const [toDateValue, setToDateValue] = useState(new Date());
	const [appInputs, setAppInputs] = useState({
		app_type: "",
		app_desc: "",
		user_id: "",
	});
	
	const handleAppChange = (e) => {
		setAppInputs((state) => ({
			...state,
			[e.target.name]: e.target.value,
		}));
	};

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };
	
	const dodZwolnienie = async () => {

	const fromDate = fromDateValue.toISOString().slice(0, 19).replace("T", " ");
	const toDate = toDateValue.toISOString().slice(0, 19).replace("T", " ");

	
		try {
			const response = await Axios.post("http://localhost:3001/schedule/zwolnienie", {
				appInputs,
        fromDate,
        toDate,
			});
	
			if (response.data.affectedRows > 0) {
				setSuccessMessage('Wniosek został wysłany pomyślnie');
        setErrorMessage('');
        setTimeout(clearSuccessMessage, 5000);
			} else {
				setErrorMessage('Nie wysłano wniosku. Spróbuj ponownie.');
        setSuccessMessage('');
        setTimeout(clearErrorMessage, 5000);
			}
		} catch (error) {
			console.log(error);
      setErrorMessage('Wystąpił błąd podczas wysyłania wniosku.');
      setSuccessMessage('');
      setTimeout(clearErrorMessage, 5000);
		}
	};

	return (
    <div className="zwolnienie">
      <div className="zwolnienieAdd__header">
        <BackButton />
        Zwolnienie lekarskie
      </div>
      <div className="zwolnienieAdd__wrapper">
        <div className="zwolnienieAdd__content">
          <div className="zwolnienieAdd__form">
            <form className="zwolnienieAdd__form__inputs">
              <input
                type="text"
                placeholder="Typ zwolnienia (L4 lub Urlop)"
                name="app_type"
                onChange={handleAppChange}
              />
              <textarea
                style={{ resize: "none" }}
                placeholder="Opis - do 250 znaków"
                name="app_desc"
                maxLength="250"
                onChange={handleAppChange}
              />

              <input
                type="text"
                placeholder="Twoje id pracownika"
                name="user_id"
                onChange={handleAppChange}
              />

              <div className="zwolnienieAdd__form__inputs__date">
                <div className="zwolnienieAdd__form__inputs__date--label">
                  Od dnia:{" "}
                </div>
                <DateTimePicker
                  onChange={setFromDateValue}
                  value={fromDateValue}
                  clearIcon={null}
                />
              </div>
              <div className="zwolnienieAdd__form__inputs__date">
                <div className="zwolnienieAdd__form__inputs__date--label">
                  Do dnia:{" "}
                </div>
                <DateTimePicker
                  onChange={setToDateValue}
                  value={toDateValue}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="zwolnienieAdd__form__inputs zwolnienieAdd__submit">
          <div className="message-container">
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
          <input type="submit" onClick={dodZwolnienie} value="Wyślij" />
        </div>
      </div>
    </div>
  );
};
		
export default Zwolnienie;
		