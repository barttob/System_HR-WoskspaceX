import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Prace.css";

const Prace = () => {
  const [jobList, setJobList] = useState([]);
  const [jobSites, setJobSites] = useState(1);
  const [jobNumber, setJobNumber] = useState(0);

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(jobNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setJobSites(i + 1);
                }}
                style={jobSites == i + 1 ? { color: "#2eb5a4" } : {}}
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
    countJobs();
    getJobs();
  }, []);

  useEffect(() => {
    getJobs();
  }, [jobSites]);

  const countJobs = () => {
    axios.get("http://localhost:3001/jobs/").then((response) => {
      setJobNumber(response.data[0].job_count);
    });
  };

  const getJobs = () => {
    axios.get(`http://localhost:3001/jobs/${jobSites}`).then((response) => {
      setJobList(response.data);
    });
  };

  return (
    <div className="prace">
      <div className="prace__header">
        Prace/projekty
        <Link to="/prace/dodaj">Dodaj pracę</Link>
      </div>
      <div className="prace__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nazwa</th>
              <th>Klient</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {jobList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.job_id}</td>
                  <td>{val.name}</td>
                  <td>
                    {val.client_first} {val.client_last}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link
                      to={`/prace/${val.job_id}/info`}
                      state={{
                        id: val.job_id,
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
      <div className="prace__buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Prace;
