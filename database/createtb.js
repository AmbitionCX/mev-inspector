const clickhouse = require('./clickhouse');
const fs = require('fs');

const arbitrages = fs.readFileSync('./arbitrages.sql').toString();
const sandwiches = fs.readFileSync('./sandwiches.sql').toString();
const liquidations = fs.readFileSync('./liquidations.sql').toString();
const nft_trades = fs.readFileSync('./nft_trades.sql').toString();
const block_summary = fs.readFileSync('./block_summary.sql').toString();
const tx_summary = fs.readFileSync('./tx_summary.sql').toString();
const load_parquet = fs.readFileSync('./load_parquet.sql').toString();

clickhouse.exec({
    query: arbitrages,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: sandwiches,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: liquidations,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: nft_trades,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: block_summary,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: tx_summary,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})

clickhouse.exec({
    query: load_parquet,
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
})