import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";

const Rozliczenia = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const [settle, setSettle] = useState([]);

  useEffect(() => {
    getSettle();
  }, []);

  const getSettle = async () => {
    try {
      axios
        .get(`http://localhost:3001/settlement/${id}`)
        .then((response) => {
          console.log(response.data);
          setSettle(response.data);
        })
        .catch((err) => {
          setSettle({
            start_date: null,
            end_date: null,
            rate: "",
            netto_rate: "",
            contract_type: "Brak",
          });
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
    console.log(val)
    try {
      const response = await axios.post(
        "http://localhost:3001/settlement/settle",
        {
          user_id: id,
          settle: val,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
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
    <div className="prace">
      <div className="pracaAdd__header">
        <BackButton />
        <div>
          {first_name} {last_name} - rozliczenie
        </div>
      </div>
      <div className="pracaInfo__content">
        {settle.map((val, key) => {
          return (
            <div key={key} className="pracaInfo__content--border">
              <div className="pracaInfo__content__desc">
                <div className="pracaInfo__content__main">
                  Okres rozliczenia
                </div>
                {printDate(val.start_date)} - {printDate(val.end_date)}
              </div>
              <div className="pracaInfo__content__desc">
                <div className="pracaInfo__content__main">Rodzaj umowy</div>
                {val.contract_type}
              </div>
              <div className="pracaInfo__content__desc">
                <div className="pracaInfo__content__main">Wyn. brutto</div>
                {val.rate} zł
              </div>
              <div className="pracaInfo__content__desc">
                <div className="pracaInfo__content__main">Wyn. netto</div>
                {val.netto_rate} zł
              </div>
              <div className="pracaAdd__form__inputs pracaAdd__submit--double">
                <input
                  type="submit"
                  onClick={() => makeSettle(val)}
                  value="Rozlicz"
                />
                <input type="submit" onClick={generatePdf} value="Raport PDF" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rozliczenia;
