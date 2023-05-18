import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";

import "./Prace.css";

const PracaInfo = () => {
  const location = useLocation();
  const { id } = location.state;

  const [job, setJob] = useState([]);
  const [empAdd, setEmpAdd] = useState("");

  const [arrNum, setArrNum] = useState(0);

  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    getJob();
    getEmps();
  }, []);

  const getJob = () => {
    axios.get(`http://localhost:3001/jobs/job/${id}`).then((response) => {
      setJob(response.data[0]);
    });
  };

  const getEmps = () => {
    axios.get(`http://localhost:3001/jobs/${id}/emps`).then((response) => {
      setEmpList(response.data);
      setArrNum(response.data.length)
    });
  };

  const addEmp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/jobs/emp/dodaj",
        {
          job_id: id,
          emp_id: empAdd,
        }
      );
      if (response.status == 200) {
      } else {
        console.log("Nie dodano");
      }
    } catch (error) {
      console.log(error);
    }
    setEmpAdd("");
    getEmps();
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
          <div className="pracaInfo__content__main">Początek</div>
          {printDate(job.start_date)}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Koniec</div>
          {printDate(job.end_date)}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Ilość prac</div>
          {arrNum}/{job.emp_quantity}
        </div>
        {/* <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Stawka</div>
          {job.emp_rate}
        </div> */}
        <div className="pracaInfo__content__pracownicy">
          <div className="pracaInfo__content__main">Pracownicy</div>
          <div className="pracaInfo__content__pracownicy--content">
            {empList.map((val, key) => {
              return <div key={key}>{val.first_name} {val.last_name}</div>;
            })}
          </div>
          <div
            className="pracaInfo__content__pracownicy--add"
            style={{ display: "flex", flexDirection: "column" }}
          >
            Dodaj pracownika do projektu
            <input
              type="text"
              placeholder="id"
              value={empAdd}
              onChange={(e) => setEmpAdd(e.target.value)}
            />
            <button onClick={addEmp}>Dodaj</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracaInfo;
