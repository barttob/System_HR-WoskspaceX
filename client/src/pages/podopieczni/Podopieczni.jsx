import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../../styles/main.css";
import "../../styles/tables.css";

const Podopieczni = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const sv_id = currentUser.user_id;

  const [chargeList, setChargeList] = useState([]);
  const [chargeSites, setChargeSites] = useState(1);
  const [chargeNumber, setChargeNumber] = useState(0);

  useEffect(() => {
    countCharges();
    getCharges();
  }, []);

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(chargeNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setChargeSites(i + 1);
                }}
                style={chargeSites == i + 1 ? { color: "#2eb5a4" } : {}}
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
    getCharges();
  }, [sv_id]);

  const countCharges = () => {
    axios.get("http://localhost:3001/charges/").then((response) => {
      setChargeNumber(response.data[0].user_count);
    });
  };

  const getCharges = () => {
    axios.get(`http://localhost:3001/charges/${sv_id}`).then((response) => {
      setChargeList(response.data);
    });
  };

  return (
    <div className="wrapper">
      <div className="header">
        Podopieczni
        <div className="header__btns">
          <Link to="/podopieczni/mieszkania">Przypisz mieszkanie</Link>
        </div>
      </div>
      <div className="table-list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id opiekuna</th>
              <th>Id podopiecznego</th>
              <th>Imię i nazwisko opiekuna</th>
              <th>Imię i nazwisko podopiecznego</th>
              <th>Id zakwaterowania</th>
              <th>Zamieszkałe od</th>
              <th>Zamieszkałe do</th>
            </tr>
          </thead>
          <tbody>
            {chargeList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["id opiekuna"]}</td>
                  <td>{val["id podopiecznego"]}</td>
                  <td>
                    {val["imie opiekuna"]} {val["nazwisko opiekuna"]}
                  </td>
                  <td>
                    {val["imie podopiecznego"]} {val["nazwisko podopiecznego"]}
                  </td>
                  <td>{val["address_id"]}</td>
                  <td>{val["start_date"]}</td>
                  <td>{val["end_date"]}</td>
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

export default Podopieczni;
