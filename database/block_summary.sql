CREATE TABLE IF NOT EXISTS mev.block_summary
(
    block_number UInt32 NOT NULL,
    miner FixedString(42) NOT NULL,
    gas_limit UInt64 NOT NULL,
    gas_used UInt64 NOT NULL,
    base_fee_per_gas UInt64 NOT NULL,
    burnt_fees UInt64 NOT NULL,
    paid_fees UInt64 NOT NULL,
    tx_amount UInt16 NOT NULL,
    arbitrages UInt16 NOT NULL,
    sandwiches UInt16 NOT NULL,
    liquidations UInt16 NOT NULL,
    nft_trades UInt16 NOT NULL,
    timestamp UInt32 NOT NULL,
) ENGINE = MergeTree()
ORDER BY (block_number)
PRIMARY KEY (block_number)