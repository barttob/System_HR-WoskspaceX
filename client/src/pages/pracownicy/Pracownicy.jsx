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
                key={i + 1}
                onClick={() => {
                  setEmployeeSites(i + 1);
                }}
                style={employeeSites == i + 1 ? { color: "#2eb5a4" } : {}}
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

  useEffect(() => {
    getEmployees();
  }, [employeeSites]);

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
        <Link to="/pracownicy/usun">Usuń pracownika</Link>
        <Link to="/pracownicy/update">Aktualizuj dane</Link>
        <Link to="/pracownicy/contracts">Kontrakty</Link>
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
                      state={{
                        id: val.user_id,
                        first_name: val.first_name,
                        last_name: val.last_name,
                      }}
                    >
                      Dokumenty
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pracownicy__buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Pracownicy;
