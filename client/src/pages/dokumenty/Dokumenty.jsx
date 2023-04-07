import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Axios from "axios";

import "./Dokumenty.css";

const Dokumenty = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    Axios.get(`http://localhost:3001/documents/${id}`).then((response) => {
      setDocList(response.data);
    });
  };

  return (
    <div className="dokumenty">
      <div className="dokumenty__header">
        <div>
          {first_name} {last_name}
        </div>
        <Link to={`/pracownicy/${id}/dokumenty/dodaj`} state={{ id: id }}>
          Dodaj dokument
        </Link>
      </div>
      <div className="pracownicy__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Rodzaj</th>
              <th>Data końca ważności</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {docList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.document_name}</td>
                  <td>{val.document_type}</td>
                  <td>{val.exp_date}</td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Link>Pobierz</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dokumenty;
