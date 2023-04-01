import React from "react";
import "./Home.css"

const Home = () => {
  const handleLoginClick = () => {
    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div className="home">
      <img src="logo.png" className="logo" alt="logo" />
      <h1>WorkspaceX</h1>
      <div className="loginButton">
        <button onClick={handleLoginClick}>Zaloguj się</button>
      </div>
    </div>
  );
};

export default Home;
