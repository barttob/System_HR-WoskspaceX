import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";

const PracownicyInfo = () => {
  const location = useLocation();
  const { id, first_name, last_name } = location.state;

  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    getUser();
    getContract();
  }, []);

  const getUser = () => {
    axios.get(`http://localhost:3001/employees/info/${id}`).then((response) => {
      setUser(response.data[0]);
    });
  };

  const getContract = () => {
    try {
      axios
        .get(`http://localhost:3001/contracts/info/${id}`)
        .then((response) => {
          const currDate = new Date();
          if (response.data[0] == null) {
            setContract(null);
          } else if (currDate > new Date(response.data[0].end_date)) {
            setContract(null);
          } else {
            setContract(response.data[0]);
          }
        });
    } catch {
      setContract(null);
    }
  };

  const sendDeleteData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/pracownicy/usun",
        {
          id: id,
          first_name: first_name,
          last_name: last_name,
        }
      );

      if (response.data.success) {
        navigate(-1);
        // setShowSuccessMessage(true);
        // setDeletedFirstName(first_name);
        // setDeletedLastName(last_name);
      } else {
        // setErrorMessage("Nie usunięto pracownika. Spróbuj ponownie.");
      }
    } catch (error) {
      // setErrorMessage("Coś poszło nie tak.");
      console.log(error);
    }
  };

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="prace">
      <div className="pracownicy__header">
        <BackButton />
        <div>
          {first_name} {last_name}
        </div>
        <div className="pracownicy__header__btns">
          <Link to="/pracownicy/update">Aktualizuj dane</Link>
          <button onClick={sendDeleteData}>Usuń pracownika</button>
        </div>
      </div>
      <div className="pracaInfo__content">
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">E-mail </div>
          {user.email}
        </div>
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Telefon </div>
          {user.phone}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Data urodzenia</div>
          {printDate(user.birth_date)}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Adres</div>
          Ulica: {user.address1} {user.address2} <br /> Miasto: {user.city}{" "}
          <br /> Kraj: {user.country}
        </div>
        <div className="pracaInfo__content__desc">
          <div className="pracaInfo__content__main">Opiekun </div>
          {user.sv_name == null ? (
            <>Brak opiekuna</>
          ) : (
            <>
              {user.sv_name} {user.sv_last}
            </>
          )}
        </div>
        <div className="pracaInfo__content__status">
          <div className="pracaInfo__content__main">Kontrakt</div>
          {contract == null ? (
            <>
              Brak aktywnego kontraktu{" "}
              <Link
                to="/pracownicy/contracts/addcontract"
                state={{
                  id: id,
                }}
              >
                Dodaj kontrakt
              </Link>
            </>
          ) : (
            <>
              Typ umowy: {contract.contract_type}
              <br />
              Początek umowy: {printDate(contract.start_date)}
              <br />
              Koniec umowy: {printDate(contract.end_date)}
              <br />
              {contract.contract_type != "Umowa zlecenie" &&
                contract.contract_type != "Umowa o dzieło" && (
                  <>Stawka brutto: {contract.rate}zł</>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracownicyInfo;
