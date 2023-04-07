import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import "./Dokumenty.css";

const DodajDokument = () => {
  const location = useLocation();
  const { id } = location.state;

  const [uploaded, setUploaded] = useState()

  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState("CV");

  const sendDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("user_id", id);
    formData.append("fileSubmit", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploaded(response.data.success)
      console.log(response.data.success);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dokumenty">
      <div className="dokumenty__header">Dodaj dokument</div>
      <div className="dokumenty__form">
        <form onSubmit={sendDocument}>
          <label htmlFor="">
            Rodzaj dokumentu:
            <select name="docType" onChange={(e) => setDocType(e.target.value)}>
              <option value="CV">CV/Ubieganie się o zatrudnienie</option>
              <option value="um_praca">Umowa o pracę</option>
              <option value="zap_reg_bhp">
                Zapoznanie się z regulaminem/zasadami BHP
              </option>
              <option value="sz_bhp">Szkolenie BHP</option>
            </select>
          </label>
          <label htmlFor="fileSubmit" className="dokumenty__label">
            <input
              type="file"
              name="fileSubmit"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              // style={{ display: "none" }}
            />
          </label>
          <input
            type="submit"
            value="Prześlij plik"
            className="dokumenty__button"
          />
        </form>
      </div>
      {uploaded && <div>Przesłano plik</div>}
    </div>
  );
};

export default DodajDokument;
