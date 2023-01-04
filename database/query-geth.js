const clickhouse = require('./clickhouse');
const { ethers } = require("ethers");
require('dotenv').config();

const geth_endpoint = process.env.GETH_ENDPOINT;
const provider = new ethers.providers.JsonRpcProvider(geth_endpoint);

const write_eth1_block = async () => {
	for ( let i = 15974501; i < 15975501; i++ ){
        let block_data = await provider.getBlock(i);
        let block_number = block_data.number;
        let block_hash = block_data.hash;
        let parent_hash = block_data.parentHash;
        let gas_limit = block_data.gasLimit.toNumber();
        let gas_used = block_data.gasUsed.toNumber();
        let base_fee_per_gas = block_data.baseFeePerGas.toNumber();
        let transactions = block_data.transactions;
        let timestamp = block_data.timestamp;

        let eth1_block_value = [{
            "block_number": block_number,
            "block_hash": block_hash,
            "parent_hash": parent_hash,
            "gas_limit": gas_limit,
            "gas_used": gas_used,
            "base_fee_per_gas": base_fee_per_gas,
            "transactions": transactions,
            "timestamp": timestamp,
        }]

        await clickhouse.insert({
            table: 'eth.eth1_block',
            values: eth1_block_value,
            format: 'JSONEachRow',
            clickhouse_settings: {
                wait_end_of_query: 1,
            },
        })
    }
}

const read_eth1_block = async () => {
    let query_data = await clickhouse.query({
        query: 'select * from eth.eth1_block limit 1',
        format: 'JSONEachRow',
    });
    let eth1_block_data = await query_data.json();
    return eth1_block_data;
}

read_eth1_block()
.then( result => console.log(result) )
.catch( (err) => {
	console.error(err);
	process.exit(1);
})
