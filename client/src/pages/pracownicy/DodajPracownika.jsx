import React from "react";
import { useState } from "react";
import axios from "axios";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-date-picker";

import "../../styles/main.css";
import "../../styles/add.css";
import "./DatePicker.css";

const DodajPracownika = () => {
  const [dateValue, setDateValue] = useState(new Date());
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    login: "",
    password: "",
    address1: "",
    address2: "",
    postal_code: "",
    city: "",
    country: "",
  });

  const handleChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setInputs({
      ...inputs,
      [fieldName]: filteredValue,
    });
  };

  const navigate = useNavigate();

  const sendRegisterData = async () => {
    const date = new Date(
      dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    try {
      const response = await axios.post(
        "http://localhost:3001/employees/addEmp",
        {
          inputs: inputs,
          date: date,
        }
      );

      if (response) {
        console.log(response);
        toast.success("Pomyślnie dodano pracownika");
        navigate(-1);
      } else {
        toast.error("Nie dodano pracownika. Spróbuj ponownie.");
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
                  handleChange(event.target.value, /[0-9]/g, event.target.name)
                }
                maxLength="50"
                value={inputs.phone}
              />
              <input
                type="text"
                placeholder="Login"
                name="login"
                onChange={(event) =>
                  handleChange(event.target.value, /./g, event.target.name)
                }
                maxLength="25"
                value={inputs.login}
              />
              <input
                type="password"
                placeholder="Hasło"
                name="password"
                onChange={(event) =>
                  handleChange(event.target.value, /./g, event.target.name)
                }
                maxLength="50"
                value={inputs.password}
              />
              <div className="add-form__inputs__date">
                Data urodzenia: 
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
          <input type="submit" onClick={sendRegisterData} value="Zarejestruj" />
        </div>
      </div>
    </div>
  );
};

export default DodajPracownika;
