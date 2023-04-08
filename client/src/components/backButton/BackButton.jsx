import React from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";

import "./BackButton.css"

const BackButton = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="backButton">
      <button onClick={goBack}>
        <MdOutlineArrowBackIos size={24} />
      </button>
    </div>
  );
};

export default BackButton;
