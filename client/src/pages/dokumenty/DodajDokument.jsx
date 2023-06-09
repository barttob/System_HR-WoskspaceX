import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";

import "./DatePicker.css";

import "../../styles/main.css";
import "../../styles/add.css";
import BackButton from "../../components/backButton/BackButton";

const DodajDokument = () => {
  const location = useLocation();
  const { id } = location.state;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [dateValue, setDateValue] = useState(new Date());
  const [showDate, setShowDate] = useState("nie");

  const navigate = useNavigate();

  let date = new Date();
  useEffect(() => {
    date = new Date(
      dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
    );
  }, [dateValue]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState("CV");

  const sendDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("user_id", id);
    currentUser.user_role == "emp"
      ? formData.append("confirmation", 0)
      : formData.append("confirmation", 1);
    let dateFormat;
    if (showDate == "tak")
      dateFormat = date.toISOString().slice(0, 19).replace("T", " ");
    else {
      date = new Date(9999, 11, 31, 23, 59, 59, 999);
      dateFormat = date.toISOString().slice(0, 19).replace("T", " ");
    }
    formData.append("exp_date", dateFormat);
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
      toast.success("Dodano plik!");
      navigate(-1);
    } catch (error) {
      toast.error("Nie udało się dodać pliku!");
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Dodaj dokument
      </div>
      <div className="add-form--docs">
        <form onSubmit={sendDocument}>
          <label htmlFor="">
            Rodzaj dokumentu:
            <select name="docType" onChange={(e) => setDocType(e.target.value)}>
              <option value="Dokumenty aplikacyjne">
                Dokumenty aplikacyjne
              </option>
              <option value="Umowa o pracę">Umowa o pracę</option>
              <option value="Dane osobowe">
                Dokumenty dotyczące danych osobowych
              </option>
              <option value="Zakres obowiązków">Zakres obowiązków</option>
              <option value="Potwierdzenia zapoznania się">
                Potwierdzenia zapoznania się m.in. z regulaminem pracy/zasadami
                BHP
              </option>
              <option value="Szkolenie">Dokumenty ze szkoleń</option>
              <option value="Inne">Inne</option>
            </select>
          </label>
          <div className="add-form__file">
            <label htmlFor="fileSubmit" className="add-label">
              <input
                type="file"
                name="fileSubmit"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
          </div>
          <div className="add-datePick">
            Czy dokument posiada datę ważności?
            <input
              type="radio"
              id="tak"
              value="tak"
              checked={showDate === "tak"}
              onChange={(e) => setShowDate(e.target.value)}
            />
            <label htmlFor="tak">Tak</label>
            <input
              type="radio"
              id="nie"
              value="nie"
              checked={showDate === "nie"}
              onChange={(e) => setShowDate(e.target.value)}
            />
            <label htmlFor="nie">Nie</label>
            <div style={{ display: showDate == "tak" ? "flex" : "none" }}>
              <DatePicker
                onChange={setDateValue}
                value={dateValue}
                clearIcon={null}
              />
            </div>
          </div>
          <input type="submit" value="Prześlij plik" className="add-button" />
        </form>
      </div>
    </div>
  );
};

export default DodajDokument;
