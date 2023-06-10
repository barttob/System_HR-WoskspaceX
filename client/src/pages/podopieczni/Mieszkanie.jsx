import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";

import "./DateTimePicker.css";
import "../../styles/main.css";
import "../../styles/add.css";

const Mieszkanie = () => {

	//const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

	const [flatList, setFlatList] = useState([]);
  const [flatSites, setFlatSites] = useState(1);
  const [flatNumber, setFlatNumber] = useState(0);
  const [isAccommodationAssigned, setIsAccommodationAssigned] = useState(false);

	useEffect(() => {
    countFlats();
    getFlats();
  }, []);

  useEffect(() => {
    checkAccommodationAssignment();
  }, []);
  

	const SiteButtons = () => {
    return (
      <>
        {(() => {
          const arr = [];
          for (let i = 0; i < Math.ceil(flatNumber / 50); i++) {
            arr.push(
              <button
                key={i + 1}
                onClick={() => {
                  setFlatSites(i + 1);
                }}
                style={flatSites == i + 1 ? { color: "#2eb5a4" } : {}}
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

	useEffect(() => {
    countFlats();
    getFlats();
  }, [flatSites]);

	const countFlats = () => {
    axios.get("http://localhost:3001/charges/mieszkania").then((response) => {
      setFlatNumber(response.data[0].address_count);
    });
  };

  const getFlats = () => {
    axios.get(`http://localhost:3001/charges/mieszkania/${flatSites}`).then((response) => {
      setFlatList(response.data);
    });
  };

  const [fromDateValue, setFromDateValue] = useState(new Date());
  const [toDateValue, setToDateValue] = useState(new Date());
  const [appInputs, setAppInputs] = useState({
    address_id: "",
    sv_id: "",
  });

  const location = useLocation();
  //const { id } = location.state;
	//const user_id = location.state.id;

  const handleAppChange = (value, regex, fieldName) => {
    const filteredValue = (value.match(regex) || []).join("");
    setAppInputs({
      ...appInputs,
      [fieldName]: filteredValue,
    });
  };

  const przypMieszkanie = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const sv_id = currentUser.user_id;
    const user_id = location.state.id;
    const start_date = fromDateValue.toISOString().slice(0, 19).replace("T", " ");
    const end_date = toDateValue.toISOString().slice(0, 19).replace("T", " ");
  
    try {
      const response = await axios.post(
        `http://localhost:3001/charges/mieszkania/${user_id}`,
        {
          appInputs,
          start_date,
          end_date,
          sv_id,
        }
      );
  
      if (response.data.affectedRows > 0) {
        setIsAccommodationAssigned(true);
        toast.success("Mieszkanie zostało przypisane pomyślnie!");
      } else {
        toast.error("Nie przypisano mieszkania. Upewnij się, że pracownik nie ma już przypisanego mieszkania.");
      }
    } catch (error) {
      toast.error("Wystąpił błąd podczas przypisywania mieszkania. Upewnij się, że pracownik nie ma już przypisanego mieszkania.");
    }
  };

  const checkAccommodationAssignment = () => {
    const user_id = location.state.id;
    axios
      .get(`http://localhost:3001/charges/mieszkania/${user_id}`)
      .then((response) => {
        if (response.data.length > 0) {
          setIsAccommodationAssigned(true);
        }
      })
      .catch((error) => {
        console.error("Błąd podczas sprawdzania przypisanego mieszkania:", error);
      });
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn--solo">
        <BackButton />
        Przypisz mieszkanie pracownikowi
      </div>
      <div className="site-content">
      {isAccommodationAssigned ? (
        <div>Mieszkanie zostało już przypisane temu pracownikowi.</div>
      ) : (
        <div className="add-form">
          <form className="add-form__inputs">
          <input
  					type="text"
  					style={{ resize: "none" }}
  					placeholder="Id adresu"
  					name="address_id"
  					onChange={(event) =>
    					handleAppChange(
      				event.target.value,
      				/[\w-\. ,]/g,
      				event.target.name
    					)
  					}
  					value={appInputs.address_id}
					/>
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">Od dnia: </div>
              <DatePicker
                onChange={setFromDateValue}
                value={fromDateValue}
                clearIcon={null}
              />
            </div>
            <div className="add-form__inputs__date">
              <div className="add-form__inputs__date--label">Do dnia: </div>
              <DatePicker
                onChange={setToDateValue}
                value={toDateValue}
                clearIcon={null}
              />
            </div>
          </form>
        </div>
      )}
        <div className="add-form__inputs add-submit">
          <input type="submit" onClick={przypMieszkanie} value="Przypisz" />
        </div>
      </div>
			<div className="header--backBtn--solo">
        Lista dostępnych mieszkań
      </div>
			<div className="table-list">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Id adresu</th>
              <th>Dzielnica</th>
              <th>Nr mieszkania</th>
              <th>Miasto</th>
              <th>Kraj</th>
							<th>Kod pocztowy</th>
            </tr>
          </thead>
          <tbody>
            {flatList.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val["address_id"]}</td>
                  <td>{val["address1"]}</td>
                  <td>{val["address2"]}</td>
                  <td>{val["city"]}</td>
                  <td>{val["country"]}</td>
									<td>{val["postal_code"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
			<div className="site-buttons">
        <SiteButtons />
      </div>
    </div>
  );
};

export default Mieszkanie;