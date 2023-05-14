import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Urlop.css";
import BackButton from "../../components/backButton/BackButton";

const Urlop = () => {
    return (
        <div className="urlop">
      <div className="urlop__header">
        Urlop
        <BackButton />
      </div>
    </div>
    );
};

export default Urlop;