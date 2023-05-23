import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";

import "../../styles/main.css";
import "../../styles/info.css";

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
        "http://localhost:3001/employees/deleteEmp",
        {
          id: id,
          first_name: first_name,
          last_name: last_name,
        }
      );

      if (response) {
        toast.success(`Usunięto pracownika ${first_name} ${last_name}!`);
        navigate(-1);
      } else {
        toast.error(
          `Nie udało się usunąć pracownika ${first_name} ${last_name}!`
        );
      }
    } catch (error) {
      toast.error(
        `Nie udało się usunąć pracownika ${first_name} ${last_name}!`
      );
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
          <Link
            to="/pracownicy/update"
            state={{
              id: id,
              first_name: first_name,
              last_name: last_name,
              email: user.email,
              phone: user.phone,
              address1: user.address1,
              address2: user.address2,
              postal_code: user.postal_code,
              city: user.city,
              country: user.country,
              birth_date: user.birth_date,
            }}
          >
            Aktualizuj dane
          </Link>
          <button onClick={sendDeleteData}>Usuń pracownika</button>
        </div>
      </div>
      <div className="info__content">
        <div className="info__content__desc">
          <div className="info__content__main">E-mail </div>
          {user.email}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Telefon </div>
          {user.phone}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Data urodzenia</div>
          {printDate(user.birth_date)}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Adres</div>
          Ulica: {user.address1} {user.address2} <br /> Miasto: {user.city}{" "}
          <br /> Kraj: {user.country}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Opiekun </div>
          {user.sv_name == null ? (
            <>Brak opiekuna</>
          ) : (
            <>
              {user.sv_name} {user.sv_last}
            </>
          )}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Kontrakt</div>
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
              Stawka brutto: {contract.rate}zł
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracownicyInfo;
