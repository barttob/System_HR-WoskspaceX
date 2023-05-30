import { useState, useEffect } from "react";
import axios from "axios";

import "../../styles/main.css";
import "../../styles/tables.css";

const Emp = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios
      .get(`http://localhost:3001/documents/expiring/${currentUser.user_id}`)
      .then((response) => {
        setDocList(response.data);
      });
  };

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="home-content">
      {docList.length != 0 ? (
        <div className="table-list--home">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Rodzaj</th>
                <th>Data końca ważności</th>
              </tr>
            </thead>
            <tbody>
              {docList.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.document_name}</td>
                    <td>{val.document_type}</td>
                    <td>
                      {val.exp_date == "9999-12-31T21:59:59.000Z"
                        ? "Brak daty końca"
                        : printDate(val.exp_date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Emp;
