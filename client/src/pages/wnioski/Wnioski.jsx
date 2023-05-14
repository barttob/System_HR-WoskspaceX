import { useState, useEffect } from "react";
import axios from "axios";
import "./Wnioski.css";
import { Link } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";

const Wnioski = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [applicationSites, setApplicationSites] = useState(1);
  const [applicationNumber, setApplicationNumber] = useState(0);

  useEffect(() => {
    countApplications();
    getApplications();
  }, []);

  useEffect(() => {
    getApplications();
  }, [applicationSites]);

  const countApplications = () => {
    axios.get("http://localhost:3001/applications/").then((response) => {
      setApplicationNumber(response.data[0].app_count);
    });
  };

  const getApplications = () => {
    axios.get(`http://localhost:3001/applications/${applicationSites}`).then((response) => {
      setApplicationList(response.data);
    });
  };

  const handleApproval = (app_id) => {
    axios
      .patch(`http://localhost:3001/applications/${app_id}`, {
      })
      .then(() => {
        console.log("Rekord został zatwierdzony.");
        getApplications();
      })
      .catch((error) => {
        console.error("Błąd podczas zatwierdzania rekordu:", error);
      });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(applicationNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setApplicationSites(i + 1);
                }}
                style={applicationSites == i + 1 ? { color: "#2eb5a4" } : {}}
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

	return (
    <div className="wnioski">
      <div className="wnioski__header">
      <BackButton />
        Wnioski pracowników
      </div>
      <div className="wnioski__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id wniosku</th>
              <th>Typ wniosku</th>
              <th>Od dnia</th>
              <th>Do dnia</th>
              <th>Opis</th>
              <th>Id pracownika</th>
              <th>Imię i nazwisko pracownika</th>
              <th>Zatwierdzono</th>
              <th>Akcja</th>
            </tr>
          </thead>
          <tbody>
            {applicationList.map((val, key) => {

              const isApproved = val['approved'];
              const rowClassName = isApproved ? 'green-background' : 'red-background';
              return (
                <tr key={key} className={rowClassName}>
                  <td>{val['app_id']}</td>
                  <td>{val['typ wniosku']}</td>
                  <td>{formatDateTime(val['od dnia'])}</td>
                  <td>{formatDateTime(val['do dnia'])}</td>
                  <td>{val['opis']}</td>
                  <td>{val['id pracownika']}</td>
                  <td>{val['imie pracownika']} {val['nazwisko pracownika']}</td>
                  <td>{val['approved']}</td>
                  <td>
                    {!val['approved'] && (
                      <button onClick={() => handleApproval(val['app_id'])}>
                        Zatwierdź
                      </button>
                    )}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link
                      to={`/applications/${val.user_id}/wniosek`}
                      state={{
                        id: val.user_id,
                      }}
                    >
                      Dokument
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="wnioski__buttons">
        <SiteButtons />
      </div>
    </div>
  );
};
	
export default Wnioski;