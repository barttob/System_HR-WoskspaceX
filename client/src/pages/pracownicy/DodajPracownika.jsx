import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DodajPracownika.css";

const DodajPracownika = () => {
  /*
  return (
    <div className="input_reg_pracownicy">
      Dodaj Pracownika
      <input type="text" placeholder="Imię"></input>
      <input type="text" placeholder="Nazwisko"></input>
      <input type="text" placeholder="E-mail"></input>
      <input type="text" placeholder="Login"></input>
      <input type="text" placeholder="Hasło"></input>
      <div className="logo__window__buttons">
          <button >Zarejestruj</button>
      </div>
    </div>
  );
  */
  return (
    <div className="register">
      <div className="register__window">
        <div className="logo__window__header">
          <img src="../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="logo__window__inputs">
          <input
            type="text"
            placeholder="Imię"
            onChange={(e) => {
              setFirst_Name(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Nazwisko"
            onChange={(e) => {
              setLast_Name(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Login"
            onChange={(e) => {
              setLogin(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Hasło"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="logo__window__buttons">
          <button>Zarejestruj</button>
        </div>
      </div>
    </div>
  );

};

export default DodajPracownika;
