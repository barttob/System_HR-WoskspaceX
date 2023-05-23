import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../styles/main.css";
import "../../styles/info.css";

const Profil = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    getUser();
    getContract();
  }, []);

  const getUser = () => {
    axios
      .get(`http://localhost:3001/employees/info/${currentUser.user_id}`)
      .then((response) => {
        setUser(response.data[0]);
      });
  };

  const getContract = () => {
    try {
      axios
        .get(`http://localhost:3001/contracts/info/${currentUser.user_id}`)
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

  const printDate = (exp_date) => {
    const date = new Date(exp_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="wrapper">
      <div className="header">
        <div>
          {currentUser.first_name} {currentUser.last_name}
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
          <div className="info__content__main">Kontrakt</div>
          {contract == null ? (
            <>Brak aktywnego kontraktu </>
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

export default Profil;
