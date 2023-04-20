const express = require("express");
const bodyParser = require("body-parser");
const clickhouse = require('./clickhouse');
const path = require('path');
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7070;

app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (request, response) => {
  response.send("database connected")
});

// query arbitrage data by block number
app.get("/arbitrages", async (request, response) => {
  let result_data = await query_arbitrages()
  response.status(200).send(result_data);
});

const query_arbitrages = async (block_number) => {
  const query = `select * from mev.arbitrages where block_number=${block_number}`
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query sandwiche data by block number
app.get("/sandwiches", async (request, response) => {
  let result_data = await query_sandwiches()
  response.status(200).send(result_data);
});

const query_sandwiches = async () => {
  const query = 'select * from mev.sandwiches limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query liquidation data by block number
app.get("/liquidations", async (request, response) => {
  let result_data = await query_liquidations()
  response.status(200).send(result_data);
});

const query_liquidations = async () => {
  const query = 'select * from mev.liquidations limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query nft trading data by block number
app.get("/nft_trades", async (request, response) => {
  let result_data = await query_nft_trades()
  response.status(200).send(result_data);
});

const query_nft_trades = async () => {
  const query = 'select * from mev.nft_trades limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query block summary by block number
app.get("/block_summary", async (request, response) => {
  let result_data = await query_block_summary()
  response.status(200).send(result_data);
});

const query_block_summary = async () => {
  const query = 'select * from mev.block_summary limit 1'
  const format = 'JSONEachRow'
  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query transaction summary data by block number
app.get("/tx_summary", async (request, response) => {
  let result_data = await query_tx_summary()
  response.status(200).send(result_data);
});

const query_tx_summary = async () => {
  const query = 'select * from mev.tx_summary limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// query mevboost data by block number
app.get("/mevboost_eth_data", async (request, response) => {
  let result_data = await query_mevboost_eth_data()
  response.status(200).send(result_data);
});

const query_mevboost_eth_data = async () => {
  const query = 'select * from mev.mevboost_eth_data limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// get the lower and higher bound of blocks in this system
app.get("/get_block_bounds", async (request, response) => {
  let result_data = await get_block_bounds()
  response.status(200).send(result_data);
});

const get_block_bounds = async () => {
  const query = 'select min(block_number) as min, max(block_number) as max from mev.block_summary'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

// get_block_bounds().then( res => console.log(res) )

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});






