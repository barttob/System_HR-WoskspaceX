import { useState, useEffect } from "react";
import axios from "axios";
import "./Pracownicy.css";

const Pracownicy = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeSites, setEmployeeSites] = useState(1);
  const [employeeNumber, setEmployeeNumber] = useState(0);

  useEffect(() => {
    countEmployees();

    getEmployees();
  }, []);

  const Buttons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(employeeNumber / 50); i++) {
            arr.push(
              <button
                key={i}
                onClick={() => {
                  setEmployeeSites(i + 1);
                  getEmployees();
                }}
              >
                {i + 1}
              </button>
            );
          }
          return arr;
        })()}
      </>
    );
  };

  const countEmployees = () => {
    axios.get("http://localhost:3001/employees/").then((response) => {
      setEmployeeNumber(response.data[0].user_count);
    });
  };

  const getEmployees = () => {
    axios
      .get(`http://localhost:3001/employees/${employeeSites}`)
      .then((response) => {
        setEmployeeList(response.data);
      });
  };

  return (
    <div className="pracownicy">
      <div className="pracownicy__header">Pracownicy</div>
      <div className="pracownicy__list">
        <div className="pracownicy__list__headers">
          <div style={{ minWidth: "80px" }}>Id</div>
          <div style={{ minWidth: "240px" }}>Imię</div>
          <div style={{ minWidth: "240px" }}>Nazwisko</div>
          <div style={{ minWidth: "340px" }}>E-mail</div>
          <div style={{ width: "100%" }}>Akcje</div>
        </div>
        {employeeList.map((val, key) => {
          return (
            <div className="pracownicy__list__content" key={key}>
              <div style={{ minWidth: "80px" }}>{val.user_id}</div>
              <div style={{ minWidth: "240px" }}>{val.first_name}</div>
              <div style={{ minWidth: "240px" }}>{val.last_name}</div>
              <div style={{ minWidth: "340px" }}>{val.email}</div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button>Informacje</button>
                <button>Dokumenty</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pracownicy__buttons">
        <Buttons />
      </div>
    </div>
  );
};

export default Pracownicy;
