import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import DatePicker from "react-date-picker";
import "./Prace.css";
import "./DatePicker.css";

import BackButton from "../../components/backButton/BackButton";

const DodajPrace = () => {
  const [client, setClient] = useState("dodaj");
  const [clientList, setClientList] = useState(null);
  const [clientSite, setClientSite] = useState(1);
  const [clientNumber, setClientNumber] = useState(null);
  const [checkedClient, setCheckedClient] = useState(null);
  const [dateValue, setDateValue] = useState(new Date());

  const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(clientNumber / 10); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setClientSite(i + 1);
                }}
                style={clientSite == i + 1 ? { color: "#2eb5a4" } : {}}
              >
                {i + 1}
              </button>
            );
          }
          return arr;
        })()}
      </>
    );
  };

  const navigate = useNavigate();

  // let date = new Date();
  // useEffect(() => {

  //   console.log(date);
  // }, [dateValue]);

  const [jobInputs, setJobInputs] = useState({
    name: "",
    desc: "",
    emp_quantity: null,
    emp_rate: null,
  });

  const [clientInputs, setClientInputs] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const handleJobChange = (e) => {
    setJobInputs((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClientChange = (e) => {
    setClientInputs((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (client == "wybierz") {
      countClients();
      getClients();
    }
  }, [client]);

  useEffect(() => {
    getClients();
  }, [clientSite]);

  const countClients = () => {
    Axios.get("http://localhost:3001/clients/").then((response) => {
      setClientNumber(response.data[0].client_count);
    });
  };

  const getClients = () => {
    Axios.get(`http://localhost:3001/clients/${clientSite}`).then(
      (response) => {
        setClientList(response.data);
      }
    );
  };

  const addJob = async () => {
    if (client == "dodaj") {
      for (const [key, value] of Object.entries(clientInputs)) {
        if (value == "") {
          return console.log("error");
        }
      }
    }
    if (client == "wybierz" && checkedClient == null) {
      return console.log("error");
    }
    try {
      if (client == "dodaj") {
        const responseClient = await Axios.post(
          "http://localhost:3001/clients/dodaj",
          {
            clientInputs,
          }
        );
        zsetClientNumber(responseClient.data.insertId);
      } else if (client == "wybierz") {
        setClientNumber(checkedClient);
      }

      const date = new Date(
        dateValue.getTime() - dateValue.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      try {
        const responseJob = await Axios.post(
          "http://localhost:3001/jobs/dodaj",
          {
            jobInputs,
            end_date: date,
            clientId: clientNumber,
          }
        );
        if (responseJob.status == 200) {
          navigate(`/prace/${responseJob.data.insertId}/info`, {
            state: { id: responseJob.data.insertId },
          });
        } else {
          console.log("Nie dodano");
        }
      } catch {}
      // console.log(responseJob);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="prace">
      <div className="pracaAdd__header">
        <BackButton />
        Dodaj pracę
      </div>
      <div className="pracaAdd__wrapper">
        <div className="pracaAdd__content">
          <div className="pracaAdd__form">
            <h2>Praca</h2>
            <form className="pracaAdd__form__inputs">
              <input
                type="text"
                placeholder="Nazwa pracy"
                name="name"
                onChange={handleJobChange}
              />
              <textarea
                style={{ resize: "none" }}
                placeholder="Opis pracy - do 250 znaków"
                name="desc"
                maxLength="250"
                onChange={handleJobChange}
              />
              <div className="pracaAdd__form__inputs__divs">
                <input
                  type="number"
                  placeholder="Ilość pracowników"
                  name="emp_quantity"
                  onChange={handleJobChange}
                />
                <input
                  type="number"
                  placeholder="Stawka pracownika"
                  name="emp_rate"
                  onChange={handleJobChange}
                />
              </div>
              <div className="pracaAdd__form__inputs__date">
                <div className="pracaAdd__form__inputs__date--label">
                  Koniec pracy:{" "}
                </div>
                <DatePicker
                  onChange={setDateValue}
                  value={dateValue}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
          <div className="pracaAdd__client">
            <div className="pracaAdd__form__klient">
              <h2>Klient</h2>
              <div className="pracaAdd__client__option">
                <div>
                  <input
                    type="radio"
                    id="dodaj"
                    value="dodaj"
                    checked={client === "dodaj"}
                    onChange={(e) => setClient(e.target.value)}
                  />
                  <label htmlFor="dodaj">Dodaj nowego klienta</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="wybierz"
                    value="wybierz"
                    checked={client === "wybierz"}
                    onChange={(e) => setClient(e.target.value)}
                  />
                  <label htmlFor="wybierz">Wybierz z pośród istniejących</label>
                </div>
              </div>
            </div>
            {client == "dodaj" ? (
              <div className="pracaAdd__client">
                <form className="pracaAdd__client__add pracaAdd__form__inputs">
                  <input
                    type="text"
                    placeholder="Imię klienta"
                    name="first_name"
                    onChange={handleClientChange}
                  />
                  <input
                    type="text"
                    placeholder="Nazwisko klienta"
                    name="last_name"
                    onChange={handleClientChange}
                  />
                  <input
                    type="text"
                    placeholder="Telefon klienta"
                    name="phone"
                    onChange={handleClientChange}
                  />
                  <input
                    type="text"
                    placeholder="E-mail klienta"
                    name="email"
                    onChange={handleClientChange}
                  />
                </form>
              </div>
            ) : (
              <div className="pracaAdd__client">
                {clientList.map((val, key) => {
                  return (
                    <div className="praceAdd__client__list" key={key}>
                      <div className="praceAdd__client__list__element">
                        <label htmlFor={val.client_id}>
                          {val.first_name} {val.last_name}
                        </label>
                        <input
                          type="radio"
                          id={val.client_id}
                          value={val.client_id}
                          checked={checkedClient == val.client_id}
                          onChange={(e) => setCheckedClient(e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="prace__buttons" style={{ marginTop: "10px" }}>
                  <SiteButtons />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="pracaAdd__form__inputs pracaAdd__submit">
          <input type="submit" onClick={addJob} />
        </div>
      </div>
    </div>
  );
};

export default DodajPrace;
