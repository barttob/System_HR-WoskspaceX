import React from "react";
import "./Home.css";

import Acc from "./acc/Acc";
import Adm from "./adm/Adm";
import Emp from "./emp/Emp";
import Per from "./per/Per";
import Sv from "./sv/Sv";

const Home = () => {
  const userRole = JSON.parse(localStorage.getItem("user")).user_role;

  return (
    <div className="home">
      <div className="home__header">
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
