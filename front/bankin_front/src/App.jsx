import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [roundedSum, setRoundedSum] = useState(0);
  const [showBalances, setShowBalances] = useState({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/accounts-info");
        const filteredAccounts = response.data.accounts.filter(
          (account) => !account.name.startsWith("Carte")
        );
        setAccounts(filteredAccounts);
        setRoundedSum(response.data.rounded_sum);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const toggleBalanceVisibility = (index) => {
    setShowBalances((prevShowBalances) => ({
      ...prevShowBalances,
      [index]: !prevShowBalances[index],
    }));
  };

  const getTotalBalanceColor = () => {
    if (roundedSum > 500) return "green";
    if (roundedSum >= 0) return "orange";
    return "red";
  };

  return (
    <div className="App">
      <header className="App-header">Bankin'</header>
      <main>
        <h1>Mes comptes</h1>
        <p style={{ color: getTotalBalanceColor() }}>
          Total des soldes arrondi : {roundedSum}€
        </p>
        <table>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index} className="account-item">
                <td>{account.name}</td>
                <td>{showBalances[index] ? `${account.balance}€` : "****"}</td>
                <td onClick={() => toggleBalanceVisibility(index)}>
                  {showBalances[index] ? <FaEyeSlash /> : <FaEye />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button>Optimiser mon épargne</button>
      </main>
    </div>
  );
};

export default App;
