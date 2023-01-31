const { createClient } = require('@clickhouse/client');
require('dotenv').config();

const clickhouse_client = createClient({
    host: process.env.CLICKHOUSE_HOST,
    user: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
})
module.exports = clickhouse_client;