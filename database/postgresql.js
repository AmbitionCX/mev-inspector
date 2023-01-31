const createConnectionPool = require('@databases/pg');
require('dotenv').config();

const pg_client = createConnectionPool(process.env.POSTGRESQL_ENDPOINT);
module.exports = pg_client;