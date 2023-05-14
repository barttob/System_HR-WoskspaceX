import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EmpDokumenty = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios
      .get(`http://localhost:3001/documents/${currentUser.user_id}`)
      .then((response) => {
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
      toast.error(`Nie udało się pobrać pliku!`);
    }
  };

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="dokumenty">
      <div className="dokumenty__header">
        <div>Dokumenty</div>
        <Link to={`/dokumenty/dodaj`} state={{ id: currentUser.user_id }}>
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
                  <td>
                    {val.exp_date == "9999-12-31T21:59:59.000Z"
                      ? "Brak daty końca"
                      : printDate(val.exp_date)}
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

export default EmpDokumenty;
