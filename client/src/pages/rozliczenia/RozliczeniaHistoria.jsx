import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const RozliczeniaHistoria = () => {
  const location = useLocation();
  const { id } = location.state;

  return <div>RozliczeniaHistoria</div>;
};

export default RozliczeniaHistoria;
