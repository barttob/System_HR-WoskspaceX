import { useState, useEffect } from "react";
import axios from "axios";
import "./Logi.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Logi = () => {

    const [logList, setLogList] = useState([]);
    const [logSites, setLogSites] = useState(1);
    const [logNumber, setLogNumber] = useState(0);
    const [deletedLogId, setDeletedLogId] = useState(null);

    useEffect(() => {
        countLogs();
        getLogs();
    }, []);

    const SiteButtons = () => {
        return (
          <>
            {(() => {
              const arr = [];
              for (let i = 0; i < Math.ceil(logNumber / 50); i++) {
                arr.push(
                  <button
                    key={i + 1}
                    onClick={() => {
                      setLogSites(i + 1);
                    }}
                    style={logSites == i + 1 ? { color: "#2eb5a4" } : {}}
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
        countLogs();
        getLogs();
    }, [logSites]);

    const countLogs = () => {
        axios.get("http://localhost:3001/logs/").then((response) => {
          setLogNumber(response.data[0].log_count);
        });
    };

    const getLogs = () => {
        axios.get(`http://localhost:3001/logs/${logSites}`).then((response) => {
          setLogList(response.data);
        });
    };

    const handleDeleteLog = (id) => {
      axios
        .delete(`http://localhost:3001/logs/${id}`)
        .then((response) => {
          setDeletedLogId(id);
          toast.success("Log został pomyślnie usunięty.");
        })
        .catch((error) => {
          console.error("Błąd podczas usuwania logu:", error);
          toast.error("Wystąpił błąd podczas usuwania logu.");
        });
    };

    return (
        <div className="logi">
          <div className="logi__header">
            <div className="logi__header__title">Logi</div>
            <div className="logi__header__btns">
            </div>
          </div>
          <div className="logi__list">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Przez użytkownika</th>
                  <th>Sygnatura czasowa</th>
                  <th>Typ akcji</th>
                  <th>Szczegóły</th>
                </tr>
              </thead>
              <tbody>
                {logList.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val["id"]}</td>
                      <td>{val["by_user"]}</td>
                      <td>{val["timestamp_log"]}</td>
                      <td>{val["action_type"]}</td>
                      <td>{val["log_details"]}</td>
                      <td
                       style={{
                           display: "flex",
                         justifyContent: "space-around",
                        }}
                       >
                         <button className="delete-button" onClick={() => handleDeleteLog(val.id)}>Usuń log</button>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="logi__buttons">
            <SiteButtons />
          </div>
        </div>
    );
};

export default Logi;