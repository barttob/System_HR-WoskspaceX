import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-date-picker";
import "./DatePicker.css";
import { toast } from "react-toastify";

import BackButton from "../../components/backButton/BackButton";
import "../../styles/main.css";
import "../../styles/add.css";

const DodajPrace = () => {
  const [client, setClient] = useState("dodaj");
  const [clientList, setClientList] = useState(null);
  const [clientSite, setClientSite] = useState(1);
  const [clientNumber, setClientNumber] = useState(null);
  const [currClient, setCurrClient] = useState(null);
  const [checkedClient, setCheckedClient] = useState(null);
  const [dateStartValue, setDateStartValue] = useState(new Date());
  const [dateEndValue, setDateEndValue] = useState(new Date());

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

  const [jobInputs, setJobInputs] = useState({
    name: "",
    desc: "",
    emp_quantity: "",
    // emp_rate: "",
  });

  const [clientInputs, setClientInputs] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const handleJobChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setJobInputs({
      ...jobInputs,
      [fieldName]: filteredValue,
    });
  };

  const handleClientChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setClientInputs({
      ...clientInputs,
      [fieldName]: filteredValue,
    });
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
    axios.get("http://localhost:3001/clients/").then((response) => {
      setClientNumber(response.data[0].client_count);
    });
  };

  const getClients = () => {
    axios
      .get(`http://localhost:3001/clients/${clientSite}`)
      .then((response) => {
        setClientList(response.data);
      });
  };

  const setClientId = async () => {
    if (client == "dodaj") {
      for (const [key, value] of Object.entries(clientInputs)) {
        if (value == "") {
          return toast.error("Nie podano wszystkich danych klienta!");
        }
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(clientInputs.email)) {
        return toast.error("Błąd w danych klienta!");
      }
    }
    if (client == "wybierz" && checkedClient == null) {
      toast.error("Nie wybrano klienta!");
    }
    try {
      if (client == "dodaj") {
        const responseClient = await axios.post(
          "http://localhost:3001/clients/dodaj",
          {
            clientInputs,
          }
        );
        setCurrClient(responseClient.data.insertId);
      } else if (client == "wybierz") {
        setCurrClient(checkedClient);
      }
    } catch (error) {
      toast.error("Nie udało się dodać klienta!");
    }
  };

  useEffect(() => {
    if (currClient != null) {
      addJob();
    }
  }, [currClient]);

  const addJob = async () => {
    if (!/[0-9]/g.test(jobInputs.emp_quantity)) {
      return toast.error("Błąd w danych pracy!");
    } else {
      const start_date = new Date(
        dateStartValue.getTime() - dateStartValue.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const end_date = new Date(
        dateEndValue.getTime() - dateEndValue.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      try {
        const responseJob = await axios.post(
          "http://localhost:3001/jobs/dodaj",
          {
            jobInputs,
            start_date: start_date,
            end_date: end_date,
            clientId: currClient,
          }
        );
        if (responseJob.status == 200) {
          toast.success("Dodano pracę!");
          navigate(`/prace/${responseJob.data.insertId}/info`, {
            state: { id: responseJob.data.insertId },
          });
        } else {
          toast.error("Nie udało się dodać pracy!");
        }
      } catch (error) {
        toast.error("Nie udało się dodać pracy!");
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Dodaj pracę
      </div>
      <div className="site-content">
        <div className="site-content--half">
          <div className="add-form">
            <h2>Praca</h2>
            <form className="add-form__inputs">
              <input
                type="text"
                placeholder="Nazwa pracy"
                name="name"
                onChange={(event) =>
                  handleJobChange(
                    event.target.value,
                    /[A-Za-z]/g,
                    event.target.name
                  )
                }
                maxLength="50"
                value={jobInputs.name}
              />
              <textarea
                style={{ resize: "none" }}
                placeholder="Opis pracy - do 250 znaków"
                name="desc"
                maxLength="250"
                onChange={(event) =>
                  handleJobChange(
                    event.target.value,
                    /[A-Za-z0-9]/g,
                    event.target.name
                  )
                }
                value={jobInputs.desc}
              />
              <input
                type="text"
                placeholder="Ilość pracowników"
                name="emp_quantity"
                onChange={(event) =>
                  handleJobChange(
                    event.target.value,
                    /[0-9]/g,
                    event.target.name
                  )
                }
                value={jobInputs.emp_quantity}
                maxLength="8"
              />
              <div className="add-form__inputs__date">
                <div className="add-form__inputs__date--label">
                  Start pracy:{" "}
                </div>
                <DatePicker
                  onChange={setDateStartValue}
                  value={dateStartValue}
                  clearIcon={null}
                />
              </div>
              <div className="add-form__inputs__date">
                <div className="add-form__inputs__date--label">
                  Koniec pracy:{" "}
                </div>
                <DatePicker
                  onChange={setDateEndValue}
                  value={dateEndValue}
                  clearIcon={null}
                />
              </div>
            </form>
          </div>
          <div className="add-client">
            <div className="add-form__klient">
              <h2>Klient</h2>
              <div className="add-client__option">
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
              <div className="add-client">
                <form className="add-client__add add-form__inputs">
                  <input
                    type="text"
                    placeholder="Imię klienta"
                    name="first_name"
                    onChange={(event) =>
                      handleClientChange(
                        event.target.value,
                        /[A-Za-z0-9]/g,
                        event.target.name
                      )
                    }
                    value={clientInputs.first_name}
                    maxLength="50"
                  />
                  <input
                    type="text"
                    placeholder="Nazwisko klienta"
                    name="last_name"
                    onChange={(event) =>
                      handleClientChange(
                        event.target.value,
                        /[A-Za-z0-9]/g,
                        event.target.name
                      )
                    }
                    value={clientInputs.last_name}
                    maxLength="50"
                  />
                  <input
                    type="text"
                    placeholder="Telefon klienta"
                    name="phone"
                    onChange={(event) =>
                      handleClientChange(
                        event.target.value,
                        /[0-9- ()]/g,
                        event.target.name
                      )
                    }
                    value={clientInputs.phone}
                    maxLength="20"
                  />
                  <input
                    type="text"
                    placeholder="E-mail klienta"
                    name="email"
                    onChange={(event) =>
                      handleClientChange(
                        event.target.value,
                        /[A-Za-z0-9@_+-.]/g,
                        event.target.name
                      )
                    }
                    value={clientInputs.email}
                    maxLength="100"
                  />
                </form>
              </div>
            ) : (
              <div className="add-client">
                {clientList.map((val, key) => {
                  return (
                    <div className="add__client__list" key={key}>
                      <div className="add__client__list__element">
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
                <div className="site-buttons" style={{ marginTop: "10px" }}>
                  <SiteButtons />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={setClientId} />
        </div>
      </div>
    </div>
  );
};

export default DodajPrace;
