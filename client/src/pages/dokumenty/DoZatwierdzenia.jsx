import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./Dokumenty.css";
import BackButton from "../../components/backButton/BackButton";

const DoZatwierdzenia = () => {
  //   const location = useLocation();
  //   const { id, first_name, last_name } = location.state;

  const id = 101;

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios
      .get(`http://localhost:3001/documents/toconfirm/1`)
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
      toast.error("Nie udało się pobrać dokumentu!");
    }
  };

  const confirmDoc = async (id) => {
    try {
      axios
        .post(`http://localhost:3001/documents/confirm/${id}`)
        .then((response) => {
          toast.success("Zatwierdzono dokument!");
          getDocs();
        });
    } catch (error) {
      toast.error("Nie udało się zatwierdzić dokumentu!");
    }
  };

  const deleteDoc = async (id) => {
    try {
      axios
        .post(`http://localhost:3001/documents/delete/${id}`)
        .then((response) => {
          toast.success("Usunięto dokument!");
          getDocs();
        });
    } catch (error) {
      toast.error("Nie udało się usunąć dokumentu!");
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
        {/* <BackButton /> */}
        <div>Dokumenty do zatwierdzenia</div>
      </div>
      <div className="pracownicy__list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Imię</th>
              <th>Nazwisko</th>
              <th>Nazwa dokumentu</th>
              <th>Rodzaj</th>
              <th>Data końca ważności</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {docList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.first_name}</td>
                  <td>{val.last_name}</td>
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
                    <button onClick={() => confirmDoc(val.doc_id)}>
                      Zatwierdź
                    </button>
                    <button onClick={() => deleteDoc(val.doc_id)}>
                      Odrzuć
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

export default DoZatwierdzenia;
