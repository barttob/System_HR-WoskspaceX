import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Opiekunowie.css";
import BackButton from "../../components/backButton/BackButton";
import { Link } from "react-router-dom";

const Opiekunowie = () => {
  const [svList, setSvList] = useState([]);
  const [svSites, setSvSites] = useState(1);
  const [svNumber, setSvNumber] = useState(0);

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(svNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setsvSites(i + 1);
                }}
                style={svSites == i + 1 ? { color: "#2eb5a4" } : {}}
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
    countSv();
    getSv();
  }, []);

  useEffect(() => {
    getSv();
  }, [svSites]);

  const countSv = () => {
    axios.get("http://localhost:3001/supervisor/").then((response) => {
      setSvNumber(response.data[0].sv_count);
    });
  };

  const getSv = () => {
    axios
      .get(`http://localhost:3001/supervisor/${svSites}`)
      .then((response) => {
        setSvList(response.data);
      });
  };

  return (
    <div className="opiekunowie">
      <div className="opiekunowie__header">
        <BackButton />
        Opiekunowie i podopieczni
        <Link to="/pracownicy/supervisor/assignsv">Przypisz opiekuna</Link>
      </div>
      <div className="opiekunowie__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id pracownika</th>
              <th>Imię pracownika</th>
              <th>Nazwisko pracownika</th>
              <th>Id opiekuna</th>
              <th>Imię opiekuna</th>
              <th>Nazwisko opiekuna</th>
            </tr>
          </thead>
          <tbody>
            {svList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["id pracownika"]}</td>
                  <td>{val["imie pracownika"]}</td>
                  <td>{val["nazwisko pracownika"]}</td>
                  <td>{val["id opiekuna"]}</td>
                  <td>{val["imie opiekuna"]}</td>
                  <td>{val["nazwisko opiekuna"]}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link
                      to={`/supervisor/${val.sv_assg_id}/info`}
                      state={{
                        id: val.sv_assg_id,
                      }}
                    >
                      Informacje
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="opiekunowie__buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Opiekunowie;
