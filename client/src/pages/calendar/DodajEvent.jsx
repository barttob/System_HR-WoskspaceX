import { useState } from "react";
import BackButton from "../../components/backButton/BackButton";
import DateTimePicker from "react-datetime-picker";
import Axios from "axios";

import "./Kalendarz.css";
import "./DateTimePicker.css";

const DodajEvent = () => {
  const [dateValue, setDateValue] = useState(new Date());

  const [eventInputs, setEventInputs] = useState({
    user_id: "",
    event_name: "",
    event_desc: "",
    event_time: "",
  });

  const handleEventChange = (e) => {
    setEventInputs((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const addEvent = async () => {
    console.log(eventInputs);
    const dateFormat = dateValue.toISOString().slice(0, 19).replace("T", " ");
    let dateEnd = new Date(dateValue);
    dateEnd.setHours(dateEnd.getHours() + parseInt(eventInputs.event_time));
    const dateEndFormat = dateEnd.toISOString().slice(0, 19).replace("T", " ");

    try {
      const response = await Axios.post(
        "http://localhost:3001/calendar/dodaj",
        {
          eventInputs,
          dateFormat,
          dateEndFormat,
        }
      );
      if (response.data.success) {
        // setShowSuccessMessage(true);
      } else {
        // setErrorMessage("Nie dodano pracownika. Spróbuj ponownie.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="kalendarz">
      <div className="kalendarzAdd__header">
        <BackButton />
        Dodaj wydarzenie
      </div>
      <div className="kalendarzAdd__wrapper">
        <div className="kalendarzAdd__content">
          <div className="kalendarzAdd__form">
            <form className="kalendarzAdd__form__inputs">
              <input
                type="text"
                placeholder="Nazwa"
                name="event_name"
                onChange={handleEventChange}
              />
              <textarea
                style={{ resize: "none" }}
                placeholder="Opis - do 250 znaków"
                name="event_desc"
                maxLength="250"
                onChange={handleEventChange}
              />

              <input
                type="text"
                placeholder="id użytkownika"
                name="user_id"
                onChange={handleEventChange}
              />

              <div className="kalendarzAdd__form__inputs__date">
                <div className="kalendarzAdd__form__inputs__date--label">
                  Data wydarzenia:{" "}
                </div>
                <DateTimePicker
                  onChange={setDateValue}
                  value={dateValue}
                  clearIcon={null}
                />
              </div>
              <div className="kalendarzAdd__form__inputs__divs">
                Długość wydarzenia:{" "}
                <input
                  type="number"
                  placeholder="Godziny"
                  name="event_time"
                  onChange={handleEventChange}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="pracaAdd__form__inputs pracaAdd__submit">
          <input type="submit" onClick={addEvent} value="Dodaj" />
        </div>
      </div>
    </div>
  );
};

export default DodajEvent;
