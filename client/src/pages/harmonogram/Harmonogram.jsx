import { useState, useEffect } from "react";
import Axios from "axios";
import "./Harmonogram.css";
import { Link } from "react-router-dom";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
    getApplications();
    //getEventData();
  }, []);

  
  const getEvents = () => {
    Axios.get(`http://localhost:3001/schedule/${id}`)
      .then((response) => {
        const tempEvents = response.data.map((element) => ({
          title: element.event_name.concat(" - ", element.event_desc),
          start: new Date(element.event_date_start),
          end: new Date(element.event_date_end),
          source: "calendar",
        }));
        setEventList(tempEvents);
      })
      .catch((error) => {
        console.log(error);
    });
  };

  const getApplications = () => {
    Axios.get(`http://localhost:3001/schedule/${id}`)
      .then((response) => {
        const tempApplications = response.data.map((element) => ({
          title: element.app_type.concat(" - ", element.app_desc),
          start: new Date(element.from_date),
          end: new Date(element.to_date),
          source: "applications",
        }));
        setEventList((prevEvents) => [...prevEvents, ...tempApplications]);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
    });
  };

  /*
  const getEventData = () => {
    Axios.get(`http://localhost:3001/schedule/${id}`)
      .then((response) => {
        const eventData = response.data.map((element) => ({
          title: element.app_type ? element.app_type.concat(" - ", element.app_desc) : element.event_name.concat(" - ", element.event_desc),
          start: element.app_type ? new Date(element.from_date) : new Date(element.event_date_start),
          end: element.app_type ? new Date(element.to_date) : new Date(element.event_date_end),
          source: element.app_type ? "applications" : "calendar",
        }));
        setEventList(eventData);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  */
  const eventStyleGetter = (event) => {
    let backgroundColor = "#FF0000"; // Kolor dla wydarzeń z tabeli emp_applications

    if (event.source === "calendar") {
      backgroundColor = "#00FF00"; // Kolor dla wydarzeń z tabeli calendar
    }

    const style = {
      backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "#000000",
      border: "0px",
      display: "block",
    };

    return {
      style,
    };
  };

  return (
    <div className="harmonogram">
      <div className="harmonogram__header">
        Harmonogram
        <Link
          to="/harmonogram/zwolnienie"
          state={{
            id: id,
          }}
        >
          Złóż wniosek o zwolnienie lekarskie lub urlop
        </Link>
      </div>
      <div className="harmonogram__content">
        <Calendar
          events={eventList}
          localizer={localizer}
          step={60}
          defaultDate={new Date()}
          messages={messages}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default Harmonogram;
