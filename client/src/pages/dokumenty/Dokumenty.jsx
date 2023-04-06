import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dokumenty = () => {
  const location = useLocation();
  const { id } = location.state;

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios.get(`http://localhost:3001/documents/${id}`).then((response) => {
      setDocList(response.data);
    });
  };

  return (
    <div>
      Pracownik id = {id}
      {docList.map((val, key) => {
        return <div key={key}>{val}</div>;
      })}
    </div>
  );
};

export default Dokumenty;
