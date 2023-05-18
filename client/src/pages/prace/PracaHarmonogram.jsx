import { Calendar, momentLocalizer } from "react-big-calendar";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import "./TimePicker.css";
import { toast } from "react-toastify";

import axios from "axios";

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

const PracaHarmonogram = () => {
  const location = useLocation();
  const { id, job_name } = location.state;
  const localizer = momentLocalizer(moment);

  const max_time = new Date();
  max_time.setHours(23);
  max_time.setMinutes(59);

  const [monday_start, setMonday_start] = useState("00:00");
  const [monday_end, setMonday_end] = useState("00:00");
  const [tuesday_start, setTuesday_start] = useState("00:00");
  const [tuesday_end, setTuesday_end] = useState("00:00");
  const [wednesday_start, setWednesday_start] = useState("00:00");
  const [wednesday_end, setWednesday_end] = useState("00:00");
  const [thursday_start, setThursday_start] = useState("00:00");
  const [thursday_end, setThursday_end] = useState("00:00");
  const [friday_start, setFriday_start] = useState("00:00");
  const [friday_end, setFriday_end] = useState("00:00");
  const [saturday_start, setSaturday_start] = useState("00:00");
  const [saturday_end, setSaturday_end] = useState("00:00");
  const [sunday_start, setSunday_start] = useState("00:00");
  const [sunday_end, setSunday_end] = useState("00:00");

  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    getSchedule();
  }, []);

  const getSchedule = () => {
    axios
      .get(`http://localhost:3001/schedule/jobschedule/${id}`)
      .then((response) => {
        const tempEvents = response.data.map((element) => ({
          title: job_name,
          start: new Date(element.schedule.start),
          end: new Date(element.schedule.end),
        }));
        setEventList(tempEvents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addSchedule = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/schedule/addschedule/${id}`,
        {
          monday_start: monday_start,
          monday_end: monday_end,
          tuesday_start: tuesday_start,
          tuesday_end: tuesday_end,
          wednesday_start: wednesday_start,
          wednesday_end: wednesday_end,
          thursday_start: thursday_start,
          thursday_end: thursday_end,
          friday_start: friday_start,
          friday_end: friday_end,
          saturday_start: saturday_start,
          saturday_end: saturday_end,
          sunday_start: sunday_start,
          sunday_end: sunday_end,
        }
      );
      if (response.status == 200) {
        toast.success("Dodano pracę!");
      } else {
        toast.error("Nie udało się dodać pracy!");
      }
    } catch (error) {
      toast.error("Nie udało się dodać pracy!");
    }
  };

  return (
    <div className="kalendarz">
      <div className="kalendarz__header">Harmonogram pracy</div>
      <div className="kalendarz__content">
        <Calendar
          events={eventList}
          localizer={localizer}
          step={60}
          defaultDate={new Date()}
          messages={messages}
        />
      </div>
      <form className="pracaAdd__form__inputs--small">
        <div className="kalendarz__dayHours">
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Poniedziałek</span>
            Start:
            <TimePicker
              onChange={setMonday_start}
              value={monday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setMonday_end}
              value={monday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Wtorek</span>
            Start:
            <TimePicker
              onChange={setTuesday_start}
              value={tuesday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setTuesday_end}
              value={tuesday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Środa</span>
            Start:
            <TimePicker
              onChange={setWednesday_start}
              value={wednesday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setWednesday_end}
              value={wednesday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Czwartek</span>
            Start:
            <TimePicker
              onChange={setThursday_start}
              value={thursday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setThursday_end}
              value={thursday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Piątek</span>
            Start:
            <TimePicker
              onChange={setFriday_start}
              value={friday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setFriday_end}
              value={friday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Sobota</span>
            Start:
            <TimePicker
              onChange={setSaturday_start}
              value={saturday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setSaturday_end}
              value={saturday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
          <div className="kalendarz__dayHours--div">
            <span className="kalendarz__dayHours--div__span">Niedziela</span>
            Start:
            <TimePicker
              onChange={setSunday_start}
              value={sunday_start}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
            Koniec:
            <TimePicker
              onChange={setSunday_end}
              value={sunday_end}
              clearIcon={null}
              clockIcon={null}
              disableClock={true}
              max={max_time}
            />
          </div>
        </div>
      </form>
      <div className="pracaAdd__form__inputs pracaAdd__submit">
        <input type="submit" onClick={addSchedule} />
      </div>
    </div>
  );
};

export default PracaHarmonogram;
