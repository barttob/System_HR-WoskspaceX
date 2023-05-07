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
          // console.log(response)
          setSettle(response.data[0]);
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

  const makeSettle = async () => {
    try {
      const response = await axios.post("http://localhost:3001/settlement/settle", {
        settle,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
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
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Okres rozliczenia</div>
          {printDate(settle.start_date)} - {printDate(settle.end_date)}
        </div>
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Rodzaj umowy</div>
          {settle.contract_type}
        </div>
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Wyn. brutto</div>
          {settle.rate} zł
        </div>
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Wyn. netto</div>
          {settle.netto_rate} zł
        </div>
        <div className="pracaAdd__form__inputs pracaAdd__submit">
          <input type="submit" onClick={makeSettle} value="Rozlicz" />
        </div>
      </div>
    </div>
  );
};

export default Rozliczenia;
