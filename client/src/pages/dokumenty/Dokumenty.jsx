import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

import "../../styles/main.css";
import "../../styles/tables.css";
import BackButton from "../../components/backButton/BackButton";

const Dokumenty = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios.get(`http://localhost:3001/documents/${id}`).then((response) => {
      setDocList(response.data);
    });
  };

  const downloadDoc = async (id, docName) => {
    try {
      axios
        .get(`http://localhost:3001/documents/download/${id}`, {
          responseType: "blob",
        })
        .then((response) => {
          console.log(response);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", docName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn">
        <BackButton />
        <div>
          {first_name} {last_name}
        </div>
        <div className="header__btns">
          <Link to={`/pracownicy/${id}/dokumenty/dodaj`} state={{ id: id }}>
            Dodaj dokument
          </Link>
        </div>
      </div>
      <div className="table-list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Rodzaj</th>
              <th>Data końca ważności</th>
              <th>Status</th>
              <th>Akcje</th>
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
                  <td>
                    {val.confirmation == false
                      ? "Niezatwierdzony"
                      : "Zatwierdzony"}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <button
                      onClick={() => downloadDoc(val.doc_id, val.document_name)}
                    >
                      Pobierz
                    </button>
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
