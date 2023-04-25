import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";

import Axios from "axios";

import "./Kalendarz.css";
import "./react-big-calendar.css";

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
    Axios.get(`http://localhost:3001/calendar/${id}`).then((response) => {
      const tempEvents = [];
      response.data.forEach((element) => {
        tempEvents.push({
          title: element.event_name.concat(" - ", element.event_desc),
          // allDay: true,
          start: new Date(element.event_date_start),
          end: new Date(element.event_date_end),
        });
      });
      setEventList(tempEvents);
    });
  };

  return (
    <div className="kalendarz">
      <div className="kalendarz__header">
        Kalendarz
        <Link to="/kalendarz/dodaj">Dodaj wydarzenie</Link>
      </div>
      <div className="kalendarz__content">
        <Calendar
          events={eventList}
          localizer={localizer}
          step={60}
          defaultDate={new Date()}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default Kalendarz;
