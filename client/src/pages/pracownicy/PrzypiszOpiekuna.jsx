import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PrzypiszOpiekuna.css";
import BackButton from "../../components/backButton/BackButton";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const PrzypiszOpiekuna = () => {
  const [sv_id, setSv_Id] = useState("");
  const [user_id, setUser_Id] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [suggestionsEmp, setSuggestionsEmp] = useState([
    { label: "initial", value: 0 },
  ]);
  const [sugEmpValue, setSugEmpValue] = useState("");
  const [empAddId, setEmpAddId] = useState(null);

  const [suggestionsSv, setSuggestionsSv] = useState([
    { label: "initial", value: 0 },
  ]);
  const [sugSvValue, setSugSvValue] = useState("");
  const [svAddId, setSvAddId] = useState(null);

  const navigate = useNavigate();

  const sendSvAssignData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/supervisor/assignsv",
        {
          sv_id: svAddId,
          user_id: empAddId,
        }
      );

      if (response) {
        toast.success("Przypisano opiekuna!");
        navigate(-1);
      } else {
        toast.error("Nie przypisano opiekuna. Sprawdź poprawność id.");
      }
    } catch (error) {
      toast.error("Coś poszło nie tak. Sprawdź poprawność id.");
      console.log(error);
    }
  };

  useEffect(() => {
    getSuggestionsEmp();
    getSuggestionsSv();
  }, []);

  useEffect(() => {
    getSuggestionsEmp();
    getSuggestionsSv();
  }, [sugEmpValue, sugSvValue]);

  const getSuggestionsEmp = () => {
    axios
      .get(`http://localhost:3001/jobs/search/emps`, {
        params: {
          search: sugEmpValue,
        },
      })
      .then((response) => {
        // console.log(response.data);
        const suggestionsEmp = response.data.map((user) => ({
          label: `${user.user_id} ${user.first_name} ${user.last_name}`,
          value: user.user_id,
        }));

        setSuggestionsEmp(suggestionsEmp);
      });
  };
  const getSuggestionsSv = () => {
    axios
      .get(`http://localhost:3001/jobs/search/svs`, {
        params: {
          search: sugSvValue,
        },
      })
      .then((response) => {
        // console.log(response.data);
        const suggestionsSv = response.data.map((user) => ({
          label: `${user.user_id} ${user.first_name} ${user.last_name}`,
          value: user.user_id,
        }));

        setSuggestionsSv(suggestionsSv);
      });
  };

  return (
    <div className="svassign">
      <div className="svassign__window">
        <BackButton />
        <div className="logo__window__header">
          <img src="../../logo.png" alt="logo" />
          <span>WorkspaceX</span>
        </div>
        <div className="svassign__window__inputs">
          {/* <input
            type="text"
            placeholder="Id opiekuna"
            onChange={(e) => {
              setSv_Id(e.target.value);
            }}
          /> */}
          Wybierz opiekuna:
          <Autocomplete
            freeSolo
            disableClearable
            id="combo-box-demo"
            options={suggestionsSv}
            getOptionLabel={(option) => option.label.toString()}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => setSvAddId(value.value)}
            onInputChange={(event, value) => setSugSvValue(value)}
          />
          <br />
          <br />
          Wybierz opiekuna:
          <Autocomplete
            freeSolo
            disableClearable
            id="combo-box-demo"
            options={suggestionsEmp}
            getOptionLabel={(option) => option.label.toString()}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => setEmpAddId(value.value)}
            onInputChange={(event, value) => setSugEmpValue(value)}
          />
          {/* <input
            type="text"
            placeholder="Id pracownika"
            onChange={(e) => {
              setUser_Id(e.target.value);
            }}
          /> */}
          <div className="error-message">{errorMessage}</div>
          {showSuccessMessage && (
            <div className="success-message">
              Pomyślnie przypisano opiekuna pracownikowi
            </div>
          )}
        </div>
        <div className="logo__window__buttons">
          <button onClick={sendSvAssignData}>Przypisz opiekuna</button>
        </div>
      </div>
    </div>
  );
};

export default PrzypiszOpiekuna;
