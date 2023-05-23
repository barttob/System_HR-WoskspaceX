import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";

import "./DateTimePicker.css";
import "../../styles/main.css";
import "../../styles/add.css";

const Zwolnienie = () => {
  const [fromDateValue, setFromDateValue] = useState(new Date());
  const [toDateValue, setToDateValue] = useState(new Date());
  const [appInputs, setAppInputs] = useState({
    app_type: "",
    app_desc: "",
  });

  const location = useLocation();
  const { id } = location.state;

  const handleAppChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setAppInputs({
      ...appInputs,
      [fieldName]: filteredValue,
    });
  };

  const dodZwolnienie = async () => {
    const fromDate = fromDateValue.toISOString().slice(0, 19).replace("T", " ");
    const toDate = toDateValue.toISOString().slice(0, 19).replace("T", " ");

    try {
      const response = await Axios.post(
        "http://localhost:3001/schedule/zwolnienie",
        {
          appInputs,
          user_id: id,
          fromDate,
          toDate,
        }
      );

      if (response.data.affectedRows > 0) {
        toast.success("Wniosek został wysłany pomyślnie!");
      } else {
        toast.error("Nie wysłano wniosku. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas wysyłania wniosku.");
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Zwolnienie lekarskie
      </div>
      <div className="site-content">
        <div className="add-form">
          <form className="add-form__inputs">
            <select
              name="contract_type"
              onChange={(event) =>
                handleAppChange(event.target.value, /[]/g, event.target.name)
              }
            >
              <option value="L4">L4</option>
              <option value="Urlop">Urlop</option>
            </select>
            <textarea
              style={{ resize: "none" }}
              placeholder="Opis - do 250 znaków"
              name="app_desc"
              maxLength="250"
              onChange={(event) =>
                handleAppChange(
                  event.target.value,
                  /[\w-\. ,]/g,
                  event.target.name
                )
              }
              value={appInputs.app_desc}
            />
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">Od dnia: </div>
              <DatePicker
                onChange={setFromDateValue}
                value={fromDateValue}
                clearIcon={null}
              />
            </div>
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">Do dnia: </div>
              <DatePicker
                onChange={setToDateValue}
                value={toDateValue}
                clearIcon={null}
              />
            </div>
          </form>
        </div>

        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={dodZwolnienie} value="Wyślij" />
        </div>
      </div>
    </div>
  );
};

export default Zwolnienie;
