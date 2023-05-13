import { useState, useEffect } from "react";
import Axios from "axios";
import "./Harmonogram.css";
import { Link } from "react-router-dom";
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

const Harmonogram = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const id = currentUser.user_id;

  const localizer = momentLocalizer(moment);

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = () => {
    Axios.get(`http://localhost:3001/schedule/${id}`)
      .then((response) => {
        const tempEvents = response.data.map((element) => ({
          title: element.event_name.concat(" - ", element.event_desc),
          start: new Date(element.event_date_start),
          end: new Date(element.event_date_end),
        }));
        setEventList(tempEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="harmonogram">
      <div className="harmonogram__header">
        Harmonogram
        <Link to="/harmonogram/wniosek">Złóż wniosek o zwolnienie lekarskie</Link>
        <Link to="/harmonogram/zwolnienie">Złóż wniosek o urlop</Link>
      </div>
      <div className="harmonogram__content">
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
}

export default Harmonogram;

