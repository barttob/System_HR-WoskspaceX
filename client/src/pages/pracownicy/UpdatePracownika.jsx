import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./UpdatePracownika.css";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";
import DatePicker from "react-date-picker";

import "../../styles/main.css";
import "../../styles/add.css";
import "./DatePicker.css";

const UpdatePracownika = () => {
  const location = useLocation();
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    address1,
    address2,
    postal_code,
    city,
    country,
    birth_date,
  } = location.state;
  const [dateValue, setDateValue] = useState(new Date(birth_date));
  const [inputs, setInputs] = useState({
    id: id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    address1: address1,
    address2: address2,
    postal_code: postal_code,
    city: city,
    country: country,
  });

  const handleChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setInputs({
      ...inputs,
      [fieldName]: filteredValue,
    });
  };

  const navigate = useNavigate();

  const sendUpdateData = async () => {
    const date = new Date(
      dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const response = await axios.post(
        "http://localhost:3001/employees/updateEmp",
        {
          inputs: inputs,
          birth_date: date,
        }
      );

      if (response) {
        toast.success(`Zaktualizowano dane!`);
        navigate(-1);
      } else {
        toast.error("Nie zaktualizowano danych. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Coś poszło nie tak.");
      console.log(error);
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Dodaj pracownika
      </div>
      <div className="site-content">
        <div className="site-content--half">
          <div className="add-form">
            <form className="add-form__inputs">
              <input
                type="text"
                placeholder="Imię"
                name="first_name"
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    /[A-Za-z]/g,
                    event.target.name
                  )
                }
                maxLength="25"
                value={inputs.first_name}
              />
              <input
                type="text"
                placeholder="Nazwisko"
                name="last_name"
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    /[A-Za-z]/g,
                    event.target.name
                  )
                }
                maxLength="25"
                value={inputs.last_name}
              />
              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    /[A-Za-z0-9@_+-.]/g,
                    event.target.name
                  )
                }
                maxLength="50"
                value={inputs.email}
              />
              <input
                type="text"
                placeholder="Telefon"
                name="phone"
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    /[0-9()+]/g,
                    event.target.name
                  )
                }
                maxLength="50"
                value={inputs.phone}
              />
              <div className="add-form__inputs__date">
                <DatePicker
                  onChange={setDateValue}
                  value={dateValue}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
          <div className="add-form">
            <form className="add-form__inputs">
              <input
                type="text"
                placeholder="Adres 1"
                name="address1"
                onChange={(event) =>
                  handleChange(event.target.value, /./g, event.target.name)
                }
                maxLength="50"
                value={inputs.address1}
              />
              <input
                type="text"
                placeholder="Adres 2"
                name="address2"
                onChange={(event) =>
                  handleChange(event.target.value, /./g, event.target.name)
                }
                maxLength="50"
                value={inputs.address2}
              />
              <input
                type="text"
                placeholder="Miasto"
                name="city"
                onChange={(event) =>
                  handleChange(event.target.value, /[\w]/g, event.target.name)
                }
                maxLength="50"
                value={inputs.city}
              />
              <input
                type="text"
                placeholder="Kod pocztowy"
                name="postal_code"
                onChange={(event) =>
                  handleChange(event.target.value, /[0-9-]/g, event.target.name)
                }
                maxLength="50"
                value={inputs.postal_code}
              />
              <input
                type="text"
                placeholder="Kraj"
                name="country"
                onChange={(event) =>
                  handleChange(event.target.value, /[\w]/g, event.target.name)
                }
                maxLength="50"
                value={inputs.country}
              />
            </form>
          </div>
        </div>
        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={sendUpdateData} value="Uaktualnij" />
        </div>
      </div>
    </div>
  );
};

export default UpdatePracownika;
