import React, { useEffect } from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Zwolnienie.css";
import BackButton from "../../components/backButton/BackButton";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";

import "./DateTimePicker.css";

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
    <div className="zwolnienie">
      <div className="zwolnienieAdd__header">
        <BackButton />
        Zwolnienie lekarskie
      </div>
      <div className="zwolnienieAdd__wrapper">
        <div className="zwolnienieAdd__content">
          <div className="zwolnienieAdd__form">
            <form className="zwolnienieAdd__form__inputs">
              <select
                name="contract_type"
                onChange={(event) =>
                  handleAppChange(event.target.value, /[]/g, event.target.name)
                }
              >
                <option value="L4">L4</option>
                <option value="Urlop">Urlop</option>
              </select>
              {/* <input
                type="text"
                placeholder="Typ zwolnienia (L4 lub Urlop)"
                name="app_type"
                onChange={(event) =>
                  handleAppChange(
                    event.target.value,
                    /[A-Za-z]/g,
                    event.target.name
                  )
                }
                maxLength="50"
                value={appInputs.app_type}
              /> */}
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
              <div className="zwolnienieAdd__form__inputs__date">
                <div className="zwolnienieAdd__form__inputs__date--label">
                  Od dnia:{" "}
                </div>
                <DatePicker
                  onChange={setFromDateValue}
                  value={fromDateValue}
                  clearIcon={null}
                />
              </div>
              <div className="zwolnienieAdd__form__inputs__date">
                <div className="zwolnienieAdd__form__inputs__date--label">
                  Do dnia:{" "}
                </div>
                <DatePicker
                  onChange={setToDateValue}
                  value={toDateValue}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="zwolnienieAdd__form__inputs zwolnienieAdd__submit">
          <input type="submit" onClick={dodZwolnienie} value="Wyślij" />
        </div>
      </div>
    </div>
  );
};

export default Zwolnienie;
