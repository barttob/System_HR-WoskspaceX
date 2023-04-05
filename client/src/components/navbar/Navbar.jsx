import React from "react";
import "./Navbar.css";
import { Navigate, useLocation } from "react-router-dom";

import { BsPersonFill } from "react-icons/bs";
import { HiHome, HiDocument } from "react-icons/hi";
import Logo from "../../assets/logo.png"


const Menu = () => {
  const location = useLocation();
  const userRole = "per";

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
              display: role.some((element) => element == userRole)
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
          name="Dokumenty"
          icon={<HiDocument size={24} />}
          role={["emp", "sv", "acc", "per", "adm"]}
        />
        <NavbarButton
          name="Wnioski"
          icon={<HiDocument size={24} />}
          role={["emp", "sv", "acc", "per"]}
        />
        <NavbarButton
          name="Harmonogram"
          icon={<HiDocument size={24} />}
          role={["emp", "sv", "acc", "per"]}
        />
        <NavbarButton
          name="Zakwaterowanie"
          icon={<HiDocument size={24} />}
          role={["emp", "sv", "per"]}
        />
        <NavbarButton
          name="Raport"
          icon={<HiDocument size={24} />}
          role={["emp", "sv"]}
        />
        <NavbarButton
          name="Użytkownicy"
          icon={<HiDocument size={24} />}
          role={["adm"]}
        />
        <NavbarButton
          name="Logi"
          icon={<HiDocument size={24} />}
          role={["adm"]}
        />
      </div>
      <div className="navbar__user">

      </div>
    </div>
  );
};

export default Menu;
