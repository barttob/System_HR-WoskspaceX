import React from "react";
import "./Home.css";

import Acc from "./acc/Acc";
import Adm from "./adm/Adm";
import Emp from "./emp/Emp";
import Per from "./per/Per";
import Sv from "./sv/Sv";

const Home = () => {
  const handleLoginClick = () => {
    window.location.href = "http://localhost:5173/login";
  };

  const userRole = JSON.parse(localStorage.getItem("user")).user_role;

  return (
    <div className="home">
      <img src="logo.png" className="logo" alt="logo" />
      <h1>WorkspaceX</h1>
      {/* <div className="loginButton">
        <button onClick={handleLoginClick}>Zaloguj się</button>
      </div> */}
      {userRole == "adm" ? (
        <Adm />
      ) : userRole == "acc" ? (
        <Acc />
      ) : userRole == "emp" ? (
        <Emp />
      ) : userRole == "per" ? (
        <Per />
      ) : userRole == "sv" ? (
        <Sv />
      ) : (
        "Brak roli"
      )}
    </div>
  );
};

export default Home;
