const clickhouse = require('./clickhouse');
const fs = require('fs');

const attestations = fs.readFileSync('./attestations.sql').toString();

clickhouse.exec({
    query: attestations,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})