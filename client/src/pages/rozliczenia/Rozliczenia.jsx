import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";
import { toast } from "react-toastify";

import "../../styles/main.css";

const Rozliczenia = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const [settle, setSettle] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    getContract();
  }, []);

  useEffect(() => {
    if (contract.length > 0) {
      getSettle();
    } else {
    }
  }, [contract]);

  const getContract = () => {
    try {
      axios
        .get(`http://localhost:3001/contracts/info/${id}`)
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
        .get(`http://localhost:3001/settlement/${id}`, {
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

  const makeSettle = async (val) => {
    let dateFormat = new Date(
      new Date(val.start_date).getTime() -
        new Date(val.start_date).getTimezoneOffset() * 60000
    );
    dateFormat = dateFormat.toISOString().slice(0, 19).replace("T", " ");
    let dateEndFormat = new Date(
      new Date(val.end_date).getTime() -
        new Date(val.end_date).getTimezoneOffset() * 60000
    );
    dateEndFormat = dateEndFormat.toISOString().slice(0, 19).replace("T", " ");
    try {
      const response = await axios.post(
        "http://localhost:3001/settlement/settle",
        {
          user_id: id,
          settle: val,
          start_date: dateFormat,
          end_date: dateEndFormat,
        }
      );
      toast.success("Rozliczono pomyślnie.");
      getSettle();
    } catch (error) {
      toast.error("Rozliczenie nie powiodło się.");
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
            first_name: first_name,
            last_name: last_name,
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
      <div className="header--backBtn">
        <BackButton />
        <div>
          {first_name} {last_name} - rozliczenie
        </div>
        <div className="header__btns">
          <Link
            to={`/pracownicy/${id}/rozliczenie/historia`}
            state={{
              id: id,
              first_name: first_name,
              last_name: last_name,
            }}
          >
            Historia
          </Link>
        </div>
      </div>
      <div className="info__content">
        {settle == []
          ? console.log("Brak")
          : settle.map((val, key) => {
              return (
                <div key={key} className="info__content--border">
                  <div className="info__content__desc">
                    <div className="info__content__main">Okres rozliczenia</div>
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
                      onClick={() => makeSettle(val)}
                      value="Rozlicz"
                    />
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

export default Rozliczenia;
