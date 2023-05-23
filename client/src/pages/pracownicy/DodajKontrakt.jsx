import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import { Link, useLocation } from "react-router-dom";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";

import "../../styles/main.css";
import "../../styles/add.css";

const DodajKontrakt = () => {
  const [start_date, setStart_Date] = useState(new Date());
  const [end_date, setEnd_Date] = useState(new Date());
  const [contract_type, setContract_Type] = useState("");

  const navigate = useNavigate();

  const [emptyType, setEmptyType] = useState(null);

  const location = useLocation();
  const { id } = location.state;

  const [inputs, setInputs] = useState({
    user_id: id,
    rate: "",
    contract_type: "-",
    user_role: "",
  });

  const handleChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setInputs({
      ...inputs,
      [fieldName]: filteredValue,
    });
  };

  const sendContractData = async () => {
    if (inputs.contract_type == "-") {
      toast.error("Wybierz typ kontraktu");
    } else if (!/[0-9]/.test(inputs.rate)) {
      toast.error("Nieprawidłowa stawka");
    } else {
      try {
        let dateFormat = new Date(
          start_date.getTime() - start_date.getTimezoneOffset() * 60000
        );
        dateFormat = dateFormat.toISOString().slice(0, 19).replace("T", " ");
        let dateEndFormat = new Date(
          end_date.getTime() - end_date.getTimezoneOffset() * 60000
        );
        dateEndFormat = dateEndFormat
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const response = await axios.post(
          "http://localhost:3001/contracts/addcontract",
          {
            inputs,
            dateFormat,
            dateEndFormat,
          }
        );

        if (response) {
          toast.success("Dodano kontrakt.");
          navigate(-1);
        } else {
          toast.error("Nie dodano kontraktu.");
        }
      } catch (error) {
        toast.error("Nie dodano kontraktu.");
        console.log(error);
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Dodaj kontrakt
      </div>
      <div className="site-content">
        <div className="add-form">
          <form className="add-form__inputs">
            <div>
              <select
                name="contract_type"
                onChange={(event) =>
                  handleChange(event.target.value, /[]/g, event.target.name)
                }
              >
                <option value="-">-</option>
                <option value="Umowa o pracę tymczasową">
                  Umowa o pracę tymczasową
                </option>
                <option value="Umowa o pracę na czas określony">
                  Umowa o pracę na czas określony
                </option>
                <option value="Umowa zlecenie">Umowa zlecenie</option>
                <option value="Umowa o dzieło">Umowa o dzieło</option>
              </select>
              {inputs.contract_type != "Umowa o pracę na czas określony" && (
                <input
                  type="text"
                  placeholder="Stawka godzinowa brutto"
                  name="rate"
                  onChange={(event) =>
                    handleChange(
                      event.target.value,
                      /[0-9]/g,
                      event.target.name
                    )
                  }
                  value={inputs.rate}
                  maxLength="10"
                />
              )}
              {inputs.contract_type == "Umowa o pracę na czas określony" && (
                <input
                  type="text"
                  placeholder="Pensja brutto"
                  name="rate"
                  onChange={(event) =>
                    handleChange(
                      event.target.value,
                      /[0-9]/g,
                      event.target.name
                    )
                  }
                  value={inputs.rate}
                  maxLength="10"
                />
              )}
            </div>
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">
                Start kontraktu:{" "}
              </div>
              <DatePicker
                onChange={setStart_Date}
                value={start_date}
                clearIcon={null}
              />
            </div>
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">
                Koniec kontraktu:{" "}
              </div>
              <DatePicker
                onChange={setEnd_Date}
                value={end_date}
                clearIcon={null}
              />
            </div>
          </form>
        </div>
        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={sendContractData} value="Dodaj" />
        </div>
        {/* <div>{emptyType == "empty" && "Wybierz typ kontraktu"}</div> */}
      </div>
    </div>
  );
};

export default DodajKontrakt;
