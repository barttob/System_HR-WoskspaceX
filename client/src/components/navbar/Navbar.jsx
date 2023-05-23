import { useState, useEffect } from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { BsPersonFill, BsCalendarFill } from "react-icons/bs";
import { HiHome, HiDocument, HiDocumentAdd } from "react-icons/hi";
import { MdWork, MdOutlineAttachMoney, MdRequestPage } from "react-icons/md";
import { VscTerminalCmd, VscAccount } from "react-icons/vsc";
import Logo from "../../assets/logo.png";

const roles = {
  adm: "admin",
  per: "kadrowy",
  acc: "księgowa",
  sv: "opiekun",
  emp: "pracownik",
};

const Menu = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response) {
        localStorage.clear();
        navigate("/login");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const NavbarButton = ({ name, icon, role }) => {
    return (
      <>
        <a href={`/${name.toLowerCase()}`}>
          <div
            className={`navbar__list__button ${
              location.pathname.substring(0, name.length + 1) ==
              `/${name.toLowerCase()}`
                ? "navbar__list__button--active"
                : ""
            }`}
            style={{
              display: role.some((element) => element == currentUser.user_role)
                ? "flex"
                : "none",
            }}
          >
            {icon}
            {name}
          </div>
        </a>
      </>
    );
  };

  return (
    <div className="navbar">
      <div className="navbar__top">
        <img className="navbar__logo" src={Logo} alt="logo" />
        <div className="navbar__list">
          <NavbarButton
            name="Home"
            icon={<HiHome size={24} />}
            role={["emp", "sv", "acc", "per", "adm"]}
          />
          <NavbarButton
            name="Pracownicy"
            icon={<BsPersonFill size={24} />}
            role={["sv", "acc", "per"]}
          />
          <NavbarButton
            name="Prace"
            icon={<MdWork size={24} />}
            role={["acc", "per"]}
          />
          <NavbarButton
            name="Kalendarz"
            icon={<BsCalendarFill size={24} />}
            role={["acc", "per"]}
          />
          <NavbarButton
            name="DoZatwierdzenia"
            icon={<HiDocumentAdd size={24} />}
            role={["acc", "per"]}
          />
          <NavbarButton
            name="Profil"
            icon={<BsPersonFill size={24} />}
            role={["emp"]}
          />
          <NavbarButton
            name="Harmonogram"
            icon={<BsCalendarFill size={24} />}
            role={["emp"]}
          />
          <NavbarButton
            name="Dokumenty"
            icon={<HiDocument size={24} />}
            role={["emp"]}
          />
          <NavbarButton
            name="Wnioski"
            icon={<MdRequestPage size={24} />}
            role={["per", "acc"]}
          />
          <NavbarButton
            name="Podopieczni"
            icon={<BsPersonFill size={24} />}
            role={["sv"]}
          />
          <NavbarButton
            name="Wynagrodzenie"
            icon={<MdOutlineAttachMoney size={24} />}
            role={["emp"]}
          />
          <NavbarButton
            name="Logi"
            icon={<VscTerminalCmd size={24} />}
            role={["adm"]}
          />
          <NavbarButton
            name="Uzytkownicy"
            icon={<VscAccount size={24} />}
            role={["adm"]}
          />
        </div>
      </div>
      <div className="navbar__bottom">
        <div className="navbar__user">
          <img src={currentUser.img_url} alt="profile" />
          <div>
            {currentUser.first_name}
            <br />
            {currentUser.last_name}
            <br />
            <span>{roles[currentUser.user_role]}</span>
          </div>
        </div>
        <button className="navbar__logout" onClick={handleLogout}>
          Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default Menu;
