import { useState, useEffect } from "react";
import axios from "axios";
import "./Harmonogram.css";
import { Link } from "react-router-dom";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";

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
    getSchedule();
  }, []);

  const getEvents = () => {
    axios
      .get(`http://localhost:3001/calendar/${id}`)
      .then((response) => {
        const tempEvents = response.data.map((element) => ({
          title: element.event_name.concat(" - ", element.event_desc),
          start: new Date(element.event_date_start),
          end: new Date(element.event_date_end),
          source: "calendar",
        }));
        setEventList((prevEvents) => {
          const newEvents = tempEvents.filter((tempEvent) => {
            return !prevEvents.some(
              (prevEvent) =>
                prevEvent.title === tempEvent.title &&
                prevEvent.start.getTime() === tempEvent.start.getTime() &&
                prevEvent.end.getTime() === tempEvent.end.getTime() &&
                prevEvent.source === tempEvent.source
            );
          });
          return [...prevEvents, ...newEvents];
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const getApplications = () => {
    axios
      .get(`http://localhost:3001/schedule/${id}`)
      .then((response) => {
        const tempApplications = response.data.map((element) => ({
          title: element.app_type.concat(" - ", element.app_desc),
          start: new Date(element.from_date),
          end: new Date(element.to_date),
          source: "applications",
        }));
        console.log(response)
        setEventList((prevEvents) => {
          const newEvents = tempApplications.filter((tempEvent) => {
            return !prevEvents.some(
              (prevEvent) =>
                prevEvent.title === tempEvent.title &&
                prevEvent.start.getTime() === tempEvent.start.getTime() &&
                prevEvent.end.getTime() === tempEvent.end.getTime() &&
                prevEvent.source === tempEvent.source
            );
          });
          return [...prevEvents, ...newEvents];
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const getSchedule = () => {
    axios
      .get(`http://localhost:3001/schedule/userjobschedule/${id}`)
      .then((response) => {
        const tempJobEvents = response.data.map((element) => ({
          title: "Praca",
          start: new Date(element.schedule.start),
          end: new Date(element.schedule.end),
          source: "job",
        }));
        setEventList((prevEvents) => {
          const newEvents = tempJobEvents.filter((tempEvent) => {
            return !prevEvents.some(
              (prevEvent) =>
                prevEvent.title === tempEvent.title &&
                prevEvent.start.getTime() === tempEvent.start.getTime() &&
                prevEvent.end.getTime() === tempEvent.end.getTime() &&
                prevEvent.source === tempEvent.source
            );
          });
          return [...prevEvents, ...newEvents];
        });
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#a0abc5";

    if (event.source === "calendar") {
      backgroundColor = "#a6f104"; // Kolor dla wydarzeń z tabeli calendar
    }

    if (event.source === "applications") {
      backgroundColor = "#f1042f"; // Kolor dla wydarzeń z tabeli emp_applications
    }

    if (event.source === "job") {
      backgroundColor = "#03c3ab"; // Kolor dla wydarzeń z tabeli calendar
    }

    const style = {
      backgroundColor,
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
