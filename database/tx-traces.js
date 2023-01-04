const clickhouse = require('./clickhouse');
const { ethers } = require("ethers");
const fs = require('fs');
require('dotenv').config();


const geth_endpoint = process.env.GETH_ENDPOINT;
const provider = new ethers.providers.JsonRpcProvider(geth_endpoint);

const get_transaction_receipt = async (tx_hash) => {
  const transaction_log = await provider.getTransactionReceipt(tx_hash);
  return transaction_log;
}

const tx_hash = "0xb72689042f313adbffbe4d192b0febc4c8a8346b75a549d5b4d4795b37180488";
get_transaction_receipt(tx_hash)
.then( result => console.log(result) )
.catch( (err) => {
	console.error(err);
	process.exit(1);
})