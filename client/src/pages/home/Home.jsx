import React from "react";
import "../../styles/main.css";

import Acc from "./Acc";
import Adm from "./Adm";
import Emp from "./Emp";
import Per from "./Per";
import Sv from "./Sv";

const Home = () => {
  const userRole = JSON.parse(localStorage.getItem("user")).user_role;

  return (
    <div className="wrapper">
      <div className="header header--solo">
        <span>Witaj w systemie WorkspaceX</span>
        {/* <img src="logo.png" alt="logo" /> */}
      </div>
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
