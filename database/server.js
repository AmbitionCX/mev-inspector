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
  response.send("connected")
});


app.get("/test", async (request, response) => {
  let result_data = await connection_test()
  response.status(200).send(result_data);
});

const connection_test = async () => {
  const query = 'select * from mev.block_summary limit 1'
  const format = 'JSONEachRow'

  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
