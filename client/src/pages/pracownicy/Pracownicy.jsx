import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/main.css"
import "../../styles/tables.css"
import { Link } from "react-router-dom";

const Pracownicy = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeSites, setEmployeeSites] = useState(1);
  const [employeeNumber, setEmployeeNumber] = useState(0);
  const [filterFirstName, setFilterFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");
  const [filterMinRate, setFilterMinRate] = useState("");
  const [filterMaxRate, setFilterMaxRate] = useState("");
  const [filterContractType, setFilterContractType] = useState("");
  const [filterContractDate, setFilterContractDate] = useState("");

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
    countEmployees();
    getEmployees();
  }, [
    employeeSites,
    filterFirstName,
    filterLastName,
    filterMinRate,
    filterMaxRate,
    filterContractType,
    filterContractDate,
  ]);

  const countEmployees = () => {
    axios
      .get("http://localhost:3001/employees/", {
        params: {
          first_name: filterFirstName,
          last_name: filterLastName,
        },
      })
      .then((response) => {
        setEmployeeNumber(response.data[0].user_count);
      });
  };

  const getEmployees = () => {
    axios
      .get(`http://localhost:3001/employees/${employeeSites}`, {
        params: {
          first_name: filterFirstName,
          last_name: filterLastName,
        },
      })
      .then((response) => {
        setEmployeeList(response.data);
      });
  };

  const handleFilterChange = (event, setterFunction, regex) => {
    const filteredValue = (event.target.value.match(regex) || []).join("");
    setterFunction(filteredValue);
  };

  return (
    <div className="wrapper">
      <div className="header">
        Pracownicy
        <div className="header__btns">
          <Link to="/pracownicy/dodaj">Dodaj pracownika</Link>
          <Link to="/pracownicy/supervisor">Przypisz opiekuna</Link>
        </div>
      </div>
      <div className="filters">
        <div className="filter">
          <label htmlFor="filterFirstName">Imię:</label>
          <input
            type="text"
            id="filterFirstName"
            value={filterFirstName}
            onChange={(event) =>
              handleFilterChange(event, setFilterFirstName, /[A-Za-z]/g)
            }
            maxLength="25"
          />
        </div>
        <div className="filter">
          <label htmlFor="filterLastName">Nazwisko:</label>
          <input
            type="text"
            id="filterLastName"
            value={filterLastName}
            onChange={(event) =>
              handleFilterChange(event, setFilterLastName, /[A-Za-z]/g)
            }
            maxLength="25"
          />
        </div>
        {/* <div className="filter">
          <label htmlFor="filterMinRate">Minimalna stawka:</label>
          <input
            type="number"
            id="filterMinRate"
            value={filterMinRate}
            onChange={(event) => handleFilterChange(event, setFilterMinRate)}
          />
        </div>
        <div className="filter">
          <label htmlFor="filterMaxRate">Maksymalna stawka:</label>
          <input
            type="number"
            id="filterMaxRate"
            value={filterMaxRate}
            onChange={(event) => handleFilterChange(event, setFilterMaxRate)}
          />
        </div>
        <div className="filter">
          <label htmlFor="filterContractType">Typ kontraktu:</label>
          <select
            id="filterContractType"
            value={filterContractType}
            onChange={(event) =>
              handleFilterChange(event, setFilterContractType)
            }
          >
            <option value="">-</option>
            <option value="Permanent">Permanent</option>
            <option value="Fixed">Fixed time</option>
            <option value="Fixed">Temporary</option>
          </select>
        </div>
        <div className="filter">
          <label htmlFor="filterContractDate">Data zawarcia kontraktu:</label>
          <input
            type="date"
            id="filterContractDate"
            value={filterContractDate}
            onChange={(event) =>
              handleFilterChange(event, setFilterContractDate)
            }
          />
        </div> */}
        {/* <button className="filter-button" onClick={getEmployees}>
          Filtruj
        </button> */}
      </div>
      <div className="table-list">
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
                    <Link
                      to={`/pracownicy/${val.user_id}/info`}
                      state={{
                        id: val.user_id,
                        first_name: val.first_name,
                        last_name: val.last_name,
                      }}
                    >
                      Informacje
                    </Link>
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
                    <Link
                      to={`/pracownicy/${val.user_id}/rozliczenie`}
                      state={{
                        id: val.user_id,
                        first_name: val.first_name,
                        last_name: val.last_name,
                      }}
                    >
                      Rozliczenie
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="site-buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Pracownicy;
