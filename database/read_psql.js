// this file read mev infomation from k8s pod (postgresql), geth client and write to clickhouse
const postgresql = require('./postgresql');
const clickhouse = require('./clickhouse');
const {sql} = require('@databases/pg');
const { ethers } = require("ethers");
require('dotenv').config();

const geth_endpoint = process.env.GETH_ENDPOINT;
const provider = new ethers.providers.JsonRpcProvider(geth_endpoint);

const query_blocks = async ( block_number_i ) => {
  let block_data = await provider.getBlock(block_number_i);
  let block_number = block_data.number;
  let gas_limit = block_data.gasLimit.toNumber();
  let gas_used = block_data.gasUsed.toNumber();
  let transactions = block_data.transactions;
  let tx_amount = block_data.transactions.length;
  let timestamp = block_data.timestamp;

  let arbitrages = await postgresql.query(sql`
    SELECT block_number, transaction_hash, protocols, account_address, profit_token_address, start_amount, end_amount, profit_amount from arbitrages where block_number = ${block_number_i};
  `);
  let arbitrage_amount = arbitrages.length;

  // arbitrage_swaps = `select s.* from swaps s join arbitrage_swaps arb_swaps on arb_swaps.swap_transaction_hash = s.transaction_hash and s. trace_address = arb_swaps.swap_trace_address`

  let sandwiches = await postgresql.query(sql`
    SELECT block_number, frontrun_swap_transaction_hash, backrun_swap_transaction_hash, profit_token_address, profit_amount from sandwiches where block_number = ${block_number_i};
  `);
  let sandwich_amount = sandwiches.length;

  let liquidations = await postgresql.query(sql`
    SELECT block_number, transaction_hash, protocol, liquidated_user, liquidator_user, debt_token_address, debt_purchase_amount, received_amount, received_token_address from liquidations where block_number = ${block_number_i};
  `);
  let liquidation_amount = liquidations.length;

  let nft_trades = await postgresql.query(sql`
    SELECT block_number, transaction_hash, abi_name, protocol, seller_address, buyer_address, payment_token_address, payment_amount from nft_trades where block_number = ${block_number_i};
  `);
  let nft_trade_amount = nft_trades.length;

  let block_summary = [{
      "block_number": block_number,
      "gas_limit": gas_limit,
      "gas_used": gas_used,
      "tx_amount": tx_amount,
      "arbitrages": arbitrage_amount,
      "sandwiches": sandwich_amount,
      "liquidations": liquidation_amount,
      "nft_trades": nft_trade_amount,
      "timestamp": timestamp,
  }];

  // await clickhouse.insert({
  //     table: 'mev.block_summary',
  //     values: block_summary,
  //     format: 'JSONEachRow',
  //     clickhouse_settings: {
  //         wait_end_of_query: 1,
  //     },
  // })

  for( const tx of transactions) {

    // let tx_data = await provider.getBlock(block_number_i);
    // let transaction_summary = [{
    //   "block_number": block_number,
    //   "tx_hash": tx_hash
    // }]
  }
}

query_blocks(12914944).catch((err) => {
  console.error(err);
  process.exit(1);
});