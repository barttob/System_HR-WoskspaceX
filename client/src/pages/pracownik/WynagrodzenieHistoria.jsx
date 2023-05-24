import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";

const WynagrodzenieHistoria = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const [salaries, setSalaries] = useState([]);
  useEffect(() => {
    getSalaries();
  }, []);

  const getSalaries = async () => {
    try {
      axios
        .get(`http://localhost:3001/settlement/salaries/${id}`)
        .then((response) => {
          setSalaries(response.data);
        })
        .catch((err) => {
          toast.error("Nie udało się pobrać danych");
        });
    } catch {
      toast.error("Nie udało się pobrać danych");
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
      <div className="header--backBtn--solo">
        <BackButton />
        <div>
          {first_name} {last_name} - historia rozliczeń
        </div>
      </div>
      <div className="info__content">
        {salaries == []
          ? console.log("Brak")
          : salaries.map((val, key) => {
              return (
                <div key={key} className="info__content--border">
                  <div className="info__content__desc">
                    <div className="info__content__main">Okres rozliczenia</div>
                    {printDate(val.from_date)} - {printDate(val.to_date)}
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Rodzaj umowy</div>
                    {val.contract_type}
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Wyn. brutto</div>
                    {val.salary_gross} zł
                  </div>
                  <div className="info__content__desc">
                    <div className="info__content__main">Wyn. netto</div>
                    {val.salary_net} zł
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

export default WynagrodzenieHistoria;
