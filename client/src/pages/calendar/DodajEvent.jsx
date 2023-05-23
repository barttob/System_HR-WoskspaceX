import { useState } from "react";
import BackButton from "../../components/backButton/BackButton";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import { toast } from "react-toastify";

import "./DateTimePicker.css";
import "../../styles/main.css";
import "../../styles/add.css";

const DodajEvent = () => {
  const [dateValue, setDateValue] = useState(new Date());

  const [eventInputs, setEventInputs] = useState({
    user_id: "",
    event_name: "",
    event_desc: "",
    event_time: "",
  });

  const handleEventChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setEventInputs({
      ...eventInputs,
      [fieldName]: filteredValue,
    });
  };

  const addEvent = async () => {
    console.log(eventInputs);
    const dateFormat = dateValue.toISOString().slice(0, 19).replace("T", " ");
    let dateEnd = new Date(dateValue);
    dateEnd.setHours(dateEnd.getHours() + parseInt(eventInputs.event_time));
    const dateEndFormat = dateEnd.toISOString().slice(0, 19).replace("T", " ");

    try {
      const response = await axios.post(
        "http://localhost:3001/calendar/dodaj",
        {
          eventInputs,
          dateFormat,
          dateEndFormat,
        }
      );
      if (response.data) {
        toast.success("Pomyślnie dodano!");
      } else {
        toast.error("Nie dodano!");
      }
    } catch (error) {
      toast.error("Nie dodano!");
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Dodaj wydarzenie
      </div>
      <div className="site-content">
        <div className="add-form">
          <form className="add-form__inputs">
            <input
              type="text"
              placeholder="Nazwa"
              name="event_name"
              onChange={(event) =>
                handleEventChange(
                  event.target.value,
                  /[A-Za-z0-9 -/]/g,
                  event.target.name
                )
              }
              maxLength="50"
              value={eventInputs.event_name}
            />
            <textarea
              style={{ resize: "none" }}
              placeholder="Opis - do 250 znaków"
              name="event_desc"
              maxLength="250"
              onChange={(event) =>
                handleEventChange(
                  event.target.value,
                  /[A-Za-z0-9 .,-/]/g,
                  event.target.name
                )
              }
              value={eventInputs.event_desc}
            />

            <input
              type="text"
              placeholder="id użytkownika"
              name="user_id"
              maxLength="10"
              onChange={(event) =>
                handleEventChange(
                  event.target.value,
                  /[0-9]/g,
                  event.target.name
                )
              }
              value={eventInputs.user_id}
            />

            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">
                Data wydarzenia:{" "}
              </div>
              <DateTimePicker
                onChange={setDateValue}
                value={dateValue}
                clearIcon={null}
              />
            </div>
            <div className="add-form__inputs__divs">
              Długość wydarzenia:{" "}
              <input
                type="text"
                placeholder="Godziny"
                name="event_time"
                maxLength="10"
                onChange={(event) =>
                  handleEventChange(
                    event.target.value,
                    /[0-9]/g,
                    event.target.name
                  )
                }
                value={eventInputs.event_time}
              />
            </div>
          </form>
        </div>

        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={addEvent} value="Dodaj" />
        </div>
      </div>
    </div>
  );
};

export default DodajEvent;
