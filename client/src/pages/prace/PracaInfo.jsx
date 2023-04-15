import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";

import "./Prace.css";

const PracaInfo = () => {
  const location = useLocation();
  const { id } = location.state;

  const [job, setJob] = useState([]);

  useEffect(() => {
    getJob();
  }, []);

  const getJob = () => {
    axios.get(`http://localhost:3001/jobs/job/${id}`).then((response) => {
      setJob(response.data[0]);
    });
  };

  const printDate = (end_date) => {
    const date = new Date(end_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="prace">
      <div className="pracaAdd__header">
        <BackButton />
        {job.name}
      </div>
      <div className="pracaInfo__content">
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Opis </div>
          {job.description}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Koniec</div>
          {printDate(job.end_date)}
        </div>
        <div className="pracaInfo__content__pracownicy">
          <div className="pracaInfo__content__main">Pracownicy</div>

        </div>
      </div>
    </div>
  );
};

export default PracaInfo;
