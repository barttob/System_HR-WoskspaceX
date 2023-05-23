import { useState, useEffect } from "react";
import axios from "axios";
import "./Uzytkownicy.css";
import { Link } from "react-router-dom";

const Uzytkownicy = () => {

    return (
        <div className="uzytkownicy">
          <div className="uzytkownicy__header">
            <div className="uzytkownicy__header__title">Użytkownicy</div>
            <div className="uzytkownicy__header__btns">
              <Link to="/uzytkownicy/roles">Przypisz role</Link>
              <Link to="/uzytkownicy/logdata">Zmień dane logowania</Link>
            </div>
          </div>
        </div>
    );
};

export default Uzytkownicy;