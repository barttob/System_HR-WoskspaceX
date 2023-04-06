import { useState, useEffect } from "react";
import axios from "axios";
import "./Pracownicy.css";
import { Link } from "react-router-dom";

const Pracownicy = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeSites, setEmployeeSites] = useState(1);
  const [employeeNumber, setEmployeeNumber] = useState(0);

  useEffect(() => {
    countEmployees();
    getEmployees();
  }, []);

  const SiteButtons = () => {
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
      <div className="pracownicy__header">
        Pracownicy
        <Link to="/pracownicy/dodaj">Dodaj pracownika</Link>
      </div>
      <div className="pracownicy__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>E-mail</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.user_id}</td>
                  <td>{val.first_name}</td>
                  <td>{val.last_name}</td>
                  <td>{val.email}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link>Informacje</Link>
                    <Link
                      to={`/pracownicy/${val.user_id}/dokumenty`}
                      state={{ id: val.user_id }}
                    >
                      Dokumenty
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <div className="pracownicy__list__headers">
          <div style={{ minWidth: "80px", fontWeight: "bold" }}>Id</div>
          <div style={{ minWidth: "240px", fontWeight: "bold" }}>Imię</div>
          <div style={{ minWidth: "240px", fontWeight: "bold" }}>Nazwisko</div>
          <div style={{ minWidth: "340px", fontWeight: "bold" }}>E-mail</div>
          <div style={{ width: "100%", fontWeight: "bold" }}>Akcje</div>
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
                <Link>Informacje</Link>
                <Link
                  to="/pracownicy/:id/dokumenty"
                  state={{ id: val.user_id }}
                >
                  Dokumenty
                </Link>
              </div>
            </div>
          );
        })} */}
      </div>
      <div className="pracownicy__buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Pracownicy;
