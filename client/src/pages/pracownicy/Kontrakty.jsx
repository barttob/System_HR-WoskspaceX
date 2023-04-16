import { useState, useEffect } from "react";
import axios from "axios";
import "./Kontrakty.css";
import { Link } from "react-router-dom";

const Kontrakty = () => {
    const [contractList, setContractList] = useState([]);
    const [contractSites, setContractSites] = useState(1);
    const [contractNumber, setContractNumber] = useState(0);
  
    const SiteButtons = () => {
      return (
        <>
          {(() => {
            const arr = [];
            for (let i = 0; i < Math.ceil(contractNumber / 50); i++) {
              arr.push(
                <button
                  key={i + 1}
                  onClick={() => {
                    setContractSites(i + 1);
                  }}
                  style={contractSites == i + 1 ? { color: "#2eb5a4" } : {}}
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
      countContracts();
      getContracts();
    }, []);
  
    useEffect(() => {
      getContracts();
    }, [contractSites]);
  
    const countContracts = () => {
      axios.get("http://localhost:3001/contracts/").then((response) => {
        setContractNumber(response.data[0].contract_count);
      });
    };
  
    const getContracts = () => {
      axios.get(`http://localhost:3001/contracts/${contractSites}`).then((response) => {
        setContractList(response.data);
      });
    };
  
    const printDate = (exp_date) => {
      const date = new Date(exp_date);
      const formattedDate = date.toLocaleDateString("pl-PL");
      return formattedDate;
    };
  
    return (
      <div className="kontrakty">
        <div className="kontrakty__header">
          Kontrakty
          <Link to="/contracts/addcontract">Dodaj kontrakt</Link>
        </div>
        <div className="kontrakty__list">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Id pracownika</th>
                <th>Początek umowy</th>
                <th>Koniec umowy</th>
                <th>Stawka</th>
                <th>Rola</th>
                <th>Typ umowy</th>
              </tr>
            </thead>
            <tbody>
              {contractList.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.contract_id}</td>
                    <td>{val.user_id}</td>
                    <td>
                      {printDate(val.start_date)}
                    </td>
                    <td>
                      {printDate(val.end_date)}
                    </td>
                    <td>{val.rate}</td>
                    <td>{val.user_role}</td>
                    <td>{val.contract_type}</td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <Link
                        to={`/contracts/${val.contract_id}/info`}
                        state={{
                          id: val.contract_id,
                        }}
                      >
                        Informacje
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="kontrakty__buttons">
          <SiteButtons />
        </div>
      </div>
    );
  };

export default Kontrakty;