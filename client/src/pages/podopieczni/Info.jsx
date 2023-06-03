import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import "./Info.css";

const Podopieczny = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userId = location.state.id;

    axios
      .get(`http://localhost:3001/charges/info/${userId}`)
      .then((response) => {
        // Obsłuż odpowiedź z API
        setUserData(response.data);
      })
      .catch((error) => {
        // Obsłuż błąd z API
        console.error(error);
      });
  }, []);

  return (
    <div className="podopieczny">
      <div className="podopieczny__header">
        <BackButton />
        <div className="podopieczny__header__title">
          Dane podopiecznego
        </div>
        {userData && userData.length > 0 && (
          <div className="podopieczny__header__name">
            {userData[0].first_name} {userData[0].last_name}
          </div>
        )}
      </div>
      <div className="podopieczny__content">
        {userData && userData.length > 0 ? (
          <form>
            <div className="podopieczny__form-group">
              <label>Email:</label>
              <span>{userData[0].email}</span>
            </div>
            <div className="podopieczny__form-group">
              <label>Nr telefonu:</label>
              <span>{userData[0].phone}</span>
            </div>
            <div className="podopieczny__form-group">
              <label>Data urodzenia:</label>
              <span>{userData[0].birth_date}</span>
            </div>
            <div className="podopieczny__form-group">
              <label>Przypisane mieszkanie:</label>
              <div className="address-info">
                <div className="address-field">
                  <label>Nazwa dzielnicy:</label>
                  <span>{userData[0].address1 || "brak"}</span>
                </div>
                <div className="address-field">
                  <label>Numer mieszkania:</label>
                  <span>{userData[0].address2 || "brak"}</span>
                </div>
                <div className="address-field">
                  <label>Kod pocztowy:</label>
                  <span>{userData[0].postal_code || "brak"}</span>
                </div>
                <div className="address-field">
                  <label>Miasto:</label>
                  <span>{userData[0].city || "brak"}</span>
                </div>
                <div className="address-field">
                  <label>Kraj:</label>
                  <span>{userData[0].country || "brak"}</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div>Brak danych dla tego użytkownika</div>
        )}
      </div>
    </div>
  );
};

export default Podopieczny;