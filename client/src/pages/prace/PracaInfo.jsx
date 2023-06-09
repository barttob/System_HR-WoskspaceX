import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../components/backButton/BackButton";
import axios from "axios";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import "../../styles/main.css";
import "../../styles/info.css";

const PracaInfo = () => {
  const location = useLocation();
  const { id } = location.state;

  const [suggestions, setSuggestions] = useState([
    { label: "initial", value: 0 },
  ]);
  const [sugValue, setSugValue] = useState("");

  // simulate async updating of options
  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/jobs/search/Emps/${""}`)
  //     .then((response) => {
  //       console.log(response.data);
  //       const suggestions = response.data.map((user) => ({
  //         label: `${user.user_id} ${user.first_name} ${user.last_name}`,
  //         value: user.user_id,
  //       }));

  //       setSuggestions(suggestions);
  //     });
  // }, []);

  const navigate = useNavigate();

  const [job, setJob] = useState([]);
  const [empAddId, setEmpAddId] = useState(null);
  // const [empAddName, setEmpAddName] = useState("");
  // const [empAddLast, setEmpAddLast] = useState("");

  const [arrNum, setArrNum] = useState(0);

  const [empList, setEmpList] = useState([]);

  useEffect(() => {
    getJob();
    getEmps();
    getSuggestions();
  }, []);

  useEffect(() => {
    // console.log(sugValue);
    getSuggestions();
  }, [sugValue]);

  const getSuggestions = () => {
    axios
      .get(`http://localhost:3001/jobs/search/emps`, {
        params: {
          search: sugValue,
        },
      })
      .then((response) => {
        // console.log(response.data);
        const suggestions = response.data.map((user) => ({
          label: `${user.user_id} ${user.first_name} ${user.last_name}`,
          value: user.user_id,
        }));

        setSuggestions(suggestions);
      });
  };

  const getJob = () => {
    axios.get(`http://localhost:3001/jobs/job/${id}`).then((response) => {
      setJob(response.data[0]);
    });
  };

  const getEmps = () => {
    axios.get(`http://localhost:3001/jobs/${id}/emps`).then((response) => {
      setEmpList(response.data);
      setArrNum(response.data.length);
    });
  };

  const addEmp = async () => {
    console.log(empAddId);
    try {
      const response = await axios.post(
        "http://localhost:3001/jobs/emp/dodaj",
        {
          job_id: id,
          emp_id: empAddId,
          // first_name: empAddName,
          // last_name: empAddLast,
        }
      );
      if (response.status == 401) {
        toast.error("Pracownik nie ma kontraktu.");
      } else if (response.status == 200) {
        toast.success("Dodano pracownika do pracy.");
      } else {
        toast.error("Nie dodano. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Nie dodano. Spróbuj ponownie.");
    }
    setEmpAddId(null);
    getEmps();
  };

  const endJob = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/jobs/endjob/${id}`,
        {
          job_id: id,
        }
      );
      if (response) {
        navigate(-1);
        toast.success("Zakończono pracę.");
      } else {
        toast.error("Nie udało się zakończyć pracy. Spróbuj ponownie.");
      }
    } catch (error) {
      toast.error("Nie udało się zakończyć pracy. Spróbuj ponownie.");
    }
  };

  const printDate = (end_date) => {
    const date = new Date(end_date);
    const formattedDate = date.toLocaleDateString("pl-PL");
    return formattedDate;
  };

  return (
    <div className="wrapper">
      <div className="header--backBtn">
        <BackButton />
        {job.name}
        <div className="header__btns">
          <button onClick={endJob}>Zakończ pracę</button>
        </div>
      </div>
      <div className="info__content">
        <div className="info__content__desc">
          <div className="info__content__main">Opis </div>
          {job.description}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Początek</div>
          {printDate(job.start_date)}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Koniec</div>
          {printDate(job.end_date)}
        </div>
        <div className="info__content__desc">
          <div className="info__content__main">Ilość prac</div>
          {arrNum}/{job.emp_quantity}
        </div>
        <div className="info__content__pracownicy">
          <div className="info__content__main">Pracownicy</div>
          <div className="info__content__pracownicy--content">
            {empList.map((val, key) => {
              return (
                <div key={key}>
                  {val.first_name} {val.last_name}
                </div>
              );
            })}
          </div>
          <div
            className="info__content__pracownicy--add"
            style={{ display: "flex", flexDirection: "column" }}
          >
            Dodaj pracownika do projektu
            <Autocomplete
              freeSolo
              disableClearable
              id="combo-box-demo"
              options={suggestions}
              getOptionLabel={(option) => option.label.toString()}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} />}
              onChange={(event, value) => setEmpAddId(value.value)}
              onInputChange={(event, value) => setSugValue(value)}
            />
            <button onClick={addEmp}>Dodaj</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracaInfo;
