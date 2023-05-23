import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "../../styles/main.css";

const Wynagrodzenie = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [settle, setSettle] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    getContract();
  }, []);

  useEffect(() => {
    if (contract.length > 0) {
      getSettle();
    }
  }, [contract]);

  const getContract = () => {
    try {
      axios
        .get(`http://localhost:3001/contracts/info/${currentUser.user_id}`)
        .then((response) => {
          const currDate = new Date();
          if (response.data[0] == null) {
            setContract([]);
          } else if (currDate > new Date(response.data[0].end_date)) {
            setContract([]);
          } else {
            setContract(response.data);
          }
        });
    } catch {
      setContract([]);
    }
  };

  const getSettle = async () => {
    try {
      axios
        .get(`http://localhost:3001/settlement/${currentUser.user_id}`, {
          params: {
            contract: JSON.stringify(contract),
          },
        })
        .then((response) => {
          setSettle(response.data);
        })
        .catch((err) => {
          setSettle([]);
        });
    } catch {
      console.log("Error");
    }
  };

  const printDate = (exp_date) => {
    if (exp_date != null) {
      const date = new Date(exp_date);
      const formattedDate = date.toLocaleDateString("pl-PL");
      return formattedDate;
    }
  };

  const generatePdf = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/settlement/gen/generate-pdf",
        {
          responseType: "blob",
          params: {
            settle: settle,
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "raport.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div>
          {currentUser.first_name} {currentUser.last_name} - rozliczenie
        </div>
      </div>
      <div className="site-content">
        {settle == []
          ? console.log("Brak")
          : settle.map((val, key) => {
              return (
                <div key={key} className="info__content--border">
                  <div className="info__content__desc">
                    <div className="info__content__main">
                      Okres rozliczenia
                    </div>
                    {printDate(val.start_date)} - {printDate(val.end_date)}
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Rodzaj umowy</div>
                    {val.contract_type}
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Wyn. brutto</div>
                    {val.rate} zł
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Wyn. netto</div>
                    {val.netto_rate} zł
                  </div>
                  <div className="add-form__inputs add-submit--double">
                    <input
                      type="submit"
                      onClick={generatePdf}
                      value="Raport PDF"
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Wynagrodzenie;
