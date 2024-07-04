const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());

const authUrl = "https://sync.bankin.com/v2/authenticate";
const accountsUrl = "https://sync.bankin.com/v2/accounts";

const authPayload = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
};

const authConfig = {
  headers: {
    "Content-Type": "application/json",
    "Bankin-Version": process.env.BANKIN_VERSION,
    "Bankin-Device": process.env.BANKIN_DEVICE,
  },
};

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur Bankin développé par H4SS4NN");
});

//fonction pour récupérer les informations des comptes
const getAccounts = async (token) => {
  const accountsConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Bankin-Version": process.env.BANKIN_VERSION,
      "Bankin-Device": process.env.BANKIN_DEVICE,
    },
  };

  try {
    const response = await axios.get(accountsUrl, accountsConfig);
    return response.data.resources;
  } catch (error) {
    console.error(
      "Error retrieving accounts:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

//fonction pour calculer le solde total arrondi

const calculateTotalBalance = (accounts) => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const roundedBalance = Math.ceil(totalBalance / 100) * 100;
  return roundedBalance;
};

//route pour les informations des comptes
app.get("/accounts-info", async (req, res) => {
  try {
    const authResponse = await axios.post(authUrl, authPayload, authConfig);
    const token = authResponse.data.access_token;
    console.log("Authentication successful");

    const accounts = await getAccounts(token);
    console.log("Accounts retrieved");

    const totalBalance = calculateTotalBalance(accounts);

    const response = {
      rounded_sum: totalBalance,
      accounts: accounts.map((account) => ({
        name: account.name,
        balance: account.balance,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Ecoute du serveur
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
