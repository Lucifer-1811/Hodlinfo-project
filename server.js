const express = require('express');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Set up Sequelize
const sequelize = new Sequelize('hodlinfo', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define the model
const Ticker = sequelize.define('Ticker', {
  name: { type: DataTypes.STRING, allowNull: false },
  last: { type: DataTypes.FLOAT, allowNull: false },
  buy: { type: DataTypes.FLOAT, allowNull: false },
  sell: { type: DataTypes.FLOAT, allowNull: false },
  volume: { type: DataTypes.FLOAT, allowNull: false },
  base_unit: { type: DataTypes.STRING, allowNull: false },
  difference: { type: DataTypes.FLOAT, allowNull: false },
  savings: { type: DataTypes.FLOAT, allowNull: false },
});

// Sync the model with the database
sequelize.sync();

// Fetch top 10 results from WazirX API and store in database
app.get('/fetch', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    const tickers = Object.values(data).slice(0, 10);

    await Ticker.destroy({ where: {}, truncate: true });
    const avgPrice = tickers.reduce((sum, ticker) => sum + parseFloat(ticker.last), 0) / tickers.length;

    for (const ticker of tickers) {
      const difference = ((ticker.last - avgPrice) / avgPrice) * 100;
      const savings = ticker.last - avgPrice;

      await Ticker.create({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
        difference,
        savings,
      });
    }
    res.send('Data fetched and stored successfully');
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Route to get stored data
app.get('/tickers', async (req, res) => {
  try {
    const tickers = await Ticker.findAll();
    res.json(tickers);
  } catch (error) {
    res.status(500).send('Error fetching data from database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





// Configure the connection to your PostgreSQL database
const client = new Client({
  user: 'your_username',
  host: 'localhost', // or your host address if it's different
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // Default PostgreSQL port
});

// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

// Example query execution
client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Current timestamp from PostgreSQL:', res.rows[0].now);
  }
  
  // Disconnect the client
  client.end();
});
