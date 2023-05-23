import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";

import axios from "axios";

import "./react-big-calendar.css";
import "../../styles/main.css";
import "../../styles/tables.css";

const messages = {
  week: "Tydzień",
  work_week: "Tydzień pracy",
  day: "Dzień",
  month: "Miesiąc",
  previous: "Poprzedni",
  next: "Następny",
  today: `Dzisiaj`,
  agenda: "Agenda",

  showMore: (total) => `+${total} więcej`,
};

const Kalendarz = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const id = currentUser.user_id;

  const localizer = momentLocalizer(moment);

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = () => {
    axios
      .get(`http://localhost:3001/calendar/get/allevents`)
      .then((response) => {
        setEventList(response.data);
      });
  };

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="wrapper">
      <div className="header">
        Kalendarz
        <Link to="/kalendarz/dodaj">Dodaj wydarzenie</Link>
      </div>
      <div className="table-list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Opis</th>
              <th>Data</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {eventList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.event_name}</td>
                  <td>{val.event_desc}</td>
                  <td>{printDate(val.event_date_start)}</td>

                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <button>Usuń</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <Calendar
          events={eventList}
          localizer={localizer}
          step={60}
          defaultDate={new Date()}
          messages={messages}
        /> */}
      </div>
    </div>
  );
};

export default Kalendarz;
