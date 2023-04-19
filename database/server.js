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
app.get("/test1", async (request, response) => {
  let result_data1 = await connection_test1()
  response.status(200).send(result_data1);
});

const connection_test = async () => {
  const query = 'select block_number from mev.block_summary limit 10'
  const format = 'JSONEachRow'
  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  return dataset;
}
const connection_test1 = async () => {
  const query = 'select block_number from mev.block_summary limit 10'
  const format = 'JSONEachRow'
  const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
  const dataset = await resultSet.json();
  // 这里调用 connection_test1 函数并将结果存储在变量中
  const result_data1 = await connection_test2(dataset);
  return result_data1;
}
const connection_test2 = async (d) => {
  res = []
  for (var i = 0; i <= 9; i++) {
    data = d[i].block_number
    const query = `select * from mev.tx_summary where block_number = ${data}`
    const format = 'JSONEachRow'
    const resultSet = await clickhouse.query({
    query: query,
    format: format,
  });
    res.push(await resultSet.json())
}
  return res;
}
// connection_test1().then(result => console.log(result))
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});






