import React, { useState, useEffect} from "react";
import axios from "axios";
import { useLocation, Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";
import "./ZmienDane.css";

const ZmienDane = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [user_role, setRole] = useState("");

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userId = location.state.id;

    // Wywołaj API, aby pobrać dane użytkownika
    // Przykładowe wywołanie API z użyciem axios:
    axios
      .get(`http://localhost:3001/users/userdata/${userId}`)
      .then((response) => {
        // Obsłuż odpowiedź z API
        setUserData(response.data);
      })
      .catch((error) => {
        // Obsłuż błąd z API
        console.error(error);
      });
  }, []);

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleLoginSubmit = () => {
    const userId = location.state.id;

    // Wywołaj API, aby zaktualizować login użytkownika w bazie danych
    // Przykładowe wywołanie API z użyciem axios:
    axios
      .put(`http://localhost:3001/users/userdata/${userId}`, {
        login: login,
      })
      .then((response) => {
        // Obsłuż odpowiedź z API
        toast.success("Login został zmieniony.");
        setLogin(""); // Zresetuj pole input po udanej zmianie
      })
      .catch((error) => {
        // Obsłuż błąd z API
        toast.error("Wystąpił błąd podczas zmiany loginu.");
        console.error(error);
      });
  };

  const handlePasswordSubmit = () => {
    const userId = location.state.id;

    // Wywołaj API, aby zaktualizować hasło użytkownika w bazie danych
    // Przykładowe wywołanie API z użyciem axios:
    axios
      .post(`http://localhost:3001/users/userdata/${userId}`, {
        password: password,
      })
      .then((response) => {
        // Obsłuż odpowiedź z API
        toast.success("Hasło zostało zmienione.");
        setPassword(""); // Zresetuj pole input po udanej zmianie
      })
      .catch((error) => {
        // Obsłuż błąd z API
        toast.error("Wystąpił błąd podczas zmiany hasła.");
        console.error(error);
      });
  };

  const handleRoleSubmit = () => {
    const userId = location.state.id;

    // Wywołaj API, aby zaktualizować rolę użytkownika w bazie danych
    // Przykładowe wywołanie API z użyciem axios:
    axios
      .patch(`http://localhost:3001/users/userdata/${userId}`, {
        user_role: user_role,
      })
      .then((response) => {
        // Obsłuż odpowiedź z API
        toast.success("Rola została zmieniona.");
        setRole(""); // Zresetuj pole input po udanej zmianie
      })
      .catch((error) => {
        // Obsłuż błąd z API
        toast.error("Wystąpił błąd podczas zmiany roli.");
        console.error(error);
      });
  };

  return (
    <div className="uzytkownicy">
      <div className="uzytkownicy__header">
        <BackButton />
        <div className="uzytkownicy__header__title">
          Dane logowania użytkownika
        </div>
        <div className="uzytkownicy__header__name">
          {userData.first_name} {userData.last_name}
        </div>
      </div>
      <div className="uzytkownicy__content">
        <form>
          <div className="uzytkownicy__form-group">
            <label>Aktualny login:</label>
            <span>{userData.login}</span>
            <input
              type="text"
              value={login}
              onChange={handleLoginChange}
              placeholder="Nowy login"
            />
            <button type="button" onClick={handleLoginSubmit}>
              Zmień login
            </button>
          </div>
          <div className="uzytkownicy__form-group">
            <label>Aktualne hasło:</label>
            <span>{userData.password}</span>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Nowe hasło"
            />
            <button type="button" onClick={handlePasswordSubmit}>
              Zmień hasło
            </button>
          </div>
          <div className="uzytkownicy__form-group">
            <label>Aktualna rola:</label>
            <span>{userData.user_role}</span>
            <select value={user_role} onChange={handleRoleChange}>
              <option value="">Wybierz rolę</option>
              <option value="adm">adm</option>
              <option value="emp">emp</option>
              <option value="sv">sv</option>
              <option value="acc">acc</option>
              <option value="per">per</option>
            </select>
            <button type="button" onClick={handleRoleSubmit}>
              Zmień rolę
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ZmienDane;