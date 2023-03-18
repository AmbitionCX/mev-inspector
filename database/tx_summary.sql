CREATE TABLE IF NOT EXISTS mev.tx_summary
(
    block_number UInt32 NOT NULL,
    tx_hash FixedString(66) NOT NULL,
    tx_index UInt16 NOT NULL,
    tx_type UInt16 NOT NULL,
    contract_address FixedString(42) NULL,
    from FixedString(42) NOT NULL,
    to FixedString(42) NOT NULL,
    gas_price UInt64 NOT NULL,
    gas_used UInt64 NOT NULL,
    priority_fee_per_gas UInt64 NOT NULL,
    max_fee_per_gas UInt64 NOT NULL,
    paid_fee UInt64 NOT NULL,
    burnt_fee UInt64 NOT NULL,
    value String NOT NULL,
) ENGINE = MergeTree()
ORDER BY (block_number, tx_index, tx_hash)
PRIMARY KEY (block_number, tx_index, tx_hash)

-- aggregation_indices 