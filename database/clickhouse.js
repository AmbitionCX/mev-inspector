const { createClient } = require('@clickhouse/client');
require('dotenv').config();

const client = createClient({
    host: process.env.CLICKHOUSE_HOST,
    user: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
})

// client.ping().then( result => { console.log(result); } )
module.exports = client;