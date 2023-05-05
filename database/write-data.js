// this file read mev infomation from k8s pod (postgresql), geth client and write to clickhouse
// block from 12914944 to 12950000
const postgresql = require('./postgresql');
const clickhouse = require('./clickhouse');
const { sql } = require('@databases/pg');
const { ethers } = require("ethers");
require('dotenv').config();

const geth_endpoint = process.env.GETH_ENDPOINT;
const provider = new ethers.providers.JsonRpcProvider(geth_endpoint);

const query_blocks = async (block_number_i) => {

  // block info
  let block_data = await provider.getBlock(block_number_i);
  let block_number = block_data.number;
  let gas_limit = block_data.gasLimit.toNumber();
  let gas_used = block_data.gasUsed.toNumber();
  var baseFeePerGas = 0;
  if (block_data.hasOwnProperty('baseFeePerGas')) { // EIP-1559
    baseFeePerGas = parseInt(block_data.baseFeePerGas.toNumber() / 10 ** 9);
  }
  let miner = block_data.miner;
  let transactions = block_data.transactions;
  let tx_amount = block_data.transactions.length;
  let timestamp = block_data.timestamp;

  let arbitrages = await postgresql.query(sql`
    SELECT block_number, transaction_hash, protocols, account_address, profit_token_address, start_amount, end_amount, profit_amount from arbitrages where block_number = ${block_number_i};
  `);
  let arbitrage_amount = arbitrages.length;

  if (arbitrage_amount != 0){
    await clickhouse.insert({
      table: 'mev.arbitrages',
      values: arbitrages,
      format: 'JSONEachRow',
      clickhouse_settings: {
          wait_end_of_query: 1,
      },
    })
  }

  let sandwiches = await postgresql.query(sql`
    SELECT id, block_number, sandwicher_address, frontrun_swap_transaction_hash, backrun_swap_transaction_hash, profit_token_address, profit_amount from sandwiches where block_number = ${block_number_i};
  `);
  let sandwich_amount = sandwiches.length;

  for (let i = 0; i < sandwich_amount; i++) {
    let item = sandwiches[i];
    let tx_hash = await postgresql.query(sql`
      SELECT transaction_hash from sandwiched_swaps where sandwich_id = ${item.id};
      `);
    
    let sandwiched_tx_hash = [];
    for (let data of tx_hash){
      sandwiched_tx_hash.push(data.transaction_hash)
    }

    delete sandwiches[i].id;
    sandwiches[i].sandwiched_transaction_hash = sandwiched_tx_hash;
  }

  if (sandwich_amount != 0){
    await clickhouse.insert({
      table: 'mev.sandwiches',
      values: sandwiches,
      format: 'JSONEachRow',
      clickhouse_settings: {
          wait_end_of_query: 1,
      },
    })
  }

  let liquidations = await postgresql.query(sql`
    SELECT block_number, transaction_hash, protocol, liquidated_user, liquidator_user, debt_token_address, debt_purchase_amount, received_amount, received_token_address from liquidations where block_number = ${block_number_i};
  `);
  let liquidation_amount = liquidations.length;

  if (liquidation_amount != 0){
    await clickhouse.insert({
      table: 'mev.liquidations',
      values: liquidations,
      format: 'JSONEachRow',
      clickhouse_settings: {
          wait_end_of_query: 1,
      },
    })
  }

  let nft_trades = await postgresql.query(sql`
    SELECT block_number, transaction_hash, abi_name, protocol, seller_address, buyer_address, payment_token_address, payment_amount, collection_address, token_id from nft_trades where block_number = ${block_number_i};
  `);
  let nft_trade_amount = nft_trades.length;

  if (nft_trade_amount != 0){
    await clickhouse.insert({
      table: 'mev.nft_trades',
      values: nft_trades,
      format: 'JSONEachRow',
      clickhouse_settings: {
          wait_end_of_query: 1,
      },
    })
  }

  let tx_summary = [];
  let paid_fees = 0;
  for( let tx_hash of transactions ) {
console.log(tx_hash);
    let tx_receipt = await provider.getTransactionReceipt(tx_hash);
    let tx_rawdata = await provider.getTransaction(tx_hash);
    let paid_fee = 0;
    let burnt_fee = 0;

    let tx_index = tx_receipt.transactionIndex;
    let from = tx_receipt.from;
    let to = tx_receipt.to;
    let tx_type = tx_receipt.type;
    let contract_address = tx_receipt.contractAddress;
    // 0x0: legacy transactions: paid fee = gasPrice, gasLimit
    // 0x1: EIP-2930: 0x0 + access list
    // 0x2: EIP-1559: maxFeePerGas

    let gas_price = parseInt(tx_receipt.effectiveGasPrice.toNumber() / 10 ** 9);
    let gas_used = tx_receipt.gasUsed.toNumber();
    let value = tx_rawdata.value.toString();


    let priority_fee_per_gas = "0";
    if ( tx_rawdata.hasOwnProperty('maxPriorityFeePerGas') ){
      priority_fee_per_gas = parseInt(tx_rawdata.maxPriorityFeePerGas.toNumber() / 10 ** 9);
    }

    let max_fee_per_gas = "0";
    if ( tx_rawdata.hasOwnProperty('maxFeePerGas') ){
      max_fee_per_gas = parseInt(tx_rawdata.maxFeePerGas.toNumber() / 10 ** 9);
    }

    burnt_fee = baseFeePerGas * gas_used;
    paid_fee = gas_price * gas_used - burnt_fee;

    let tx_info = {
      "block_number": block_number_i,
      "tx_hash": tx_hash,
      "tx_index": tx_index,
      "tx_type": tx_type,
      "contract_address": contract_address,
      "from": from,
      "to": to,
      "gas_price": gas_price,
      "gas_used": gas_used,
      "priority_fee_per_gas": priority_fee_per_gas,
      "max_fee_per_gas": max_fee_per_gas,
      "paid_fee": paid_fee,
      "burnt_fee": burnt_fee,
      "value": value,
    };

    paid_fees += paid_fee;
    tx_summary.push(tx_info);
  }

  await clickhouse.insert({
    table: 'mev.tx_summary',
    values: tx_summary,
    format: 'JSONEachRow',
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
  })

  let block_summary = [{
    "block_number": block_number,
    "miner": miner,
    "gas_limit": gas_limit,
    "gas_used": gas_used,
    "base_fee_per_gas": baseFeePerGas,
    "burnt_fees": gas_used * baseFeePerGas,
    "paid_fees": paid_fees,
    "tx_amount": tx_amount,
    "arbitrages": arbitrage_amount,
    "sandwiches": sandwich_amount,
    "liquidations": liquidation_amount,
    "nft_trades": nft_trade_amount,
    "timestamp": timestamp,
  }];

  await clickhouse.insert({
    table: 'mev.block_summary',
    values: block_summary,
    format: 'JSONEachRow',
    clickhouse_settings: {
        wait_end_of_query: 1,
    },
  })
}

// 12914944
// 16852488
const execute = async (start, end) => {
  for (let i = start; i < end; i++) {
    await query_blocks(i);
    console.log("finished block: ", i);
    await new Promise(r => setTimeout(r, 1000));
  }
}

execute(12914944, 12920000);
