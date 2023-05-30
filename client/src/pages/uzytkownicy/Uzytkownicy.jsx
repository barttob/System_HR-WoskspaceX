import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "../../styles/main.css";
import "../../styles/tables.css";

const Uzytkownicy = () => {
  const [userList, setUserList] = useState([]);
  const [userSites, setUserSites] = useState(1);
  const [userNumber, setUserNumber] = useState(0);

  useEffect(() => {
    countUsers();
    getUsers();
  }, []);

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(userNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setUserSites(i + 1);
                }}
                style={userSites == i + 1 ? { color: "#2eb5a4" } : {}}
              >
                {i + 1}
              </button>
            );
          }
          return arr;
        })()}
      </>
    );
  };

  useEffect(() => {
    countUsers();
    getUsers();
  }, [userSites]);

  const countUsers = () => {
    axios.get("http://localhost:3001/users/").then((response) => {
      setUserNumber(response.data[0].user_count);
    });
  };

  const getUsers = () => {
    axios.get(`http://localhost:3001/users/${userSites}`).then((response) => {
      setUserList(response.data);
    });
  };

  return (
    <div className="wrapper">
      <div className="header">
        Użytkownicy
      </div>
      <div className="table-list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id użytkownika</th>
              <th>Login</th>
              <th>Hasło</th>
              <th>Rola</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["user_id"]}</td>
                  <td>{val["login"]}</td>
                  <td>{val["password"]}</td>
                  <td>{val["user_role"]}</td>
                  <td style={{ display: "flex", flexDirection: "column" }}>
                    <Link
                      to={`/uzytkownicy/${val.user_id}/userdata`}
                      state={{
                        id: val.user_id,
                      }}
                      className="button"
                    >
                      Zmień dane logowania lub rolę
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="site-buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Uzytkownicy;
