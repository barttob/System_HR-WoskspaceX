import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

  const handleDelete = (podopiecznyId) => {
    axios.delete(`http://localhost:3001/charges/${podopiecznyId}`)
      .then((response) => {
        if (response.data.message === "Pracownik został pomyślnie usunięty z mieszkania.") {
          toast.success("Pracownik został usunięty z mieszkania.");
        } else if (response.data.message === "Pracownik już jest usunięty z mieszkania.") {
          toast.info("Pracownik już jest usunięty z mieszkania.");
        }
      })
      .catch((error) => {
        toast.error("Wystąpił błąd podczas usuwania rekordu.");
        console.error("Wystąpił błąd podczas usuwania rekordu.", error);
      });
  };

  return (
    <div className="wrapper">
      <div className="header">
        Twoi podopieczni
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
              <th>Akcje</th>
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
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link
                      to={`/podopieczni/${val["id podopiecznego"]}/mieszkania`}
                      state={{
                        id: val["id podopiecznego"],
                      }}
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#03c3ab",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      Przypisz mieszkanie
                    </Link>
                    <button
                      style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "10px",
                      fontWeight: "700",
                    }}
                      onClick={() => handleDelete(val["id podopiecznego"])}
                    >
                     Usuń z mieszkania
                   </button>
                   <Link
                      to={`/podopieczni/${val["id podopiecznego"]}/info`}
                      state={{
                        id: val["id podopiecznego"],
                      }}
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#673147",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      Info
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

export default Podopieczni;
