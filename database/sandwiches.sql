CREATE TABLE IF NOT EXISTS mev.sandwiches
(
    block_number UInt32 NOT NULL,
    sandwicher_address FixedString(42) NOT NULL,
    sandwiched_transaction_hash Array(FixedString(66)),
    frontrun_swap_transaction_hash FixedString(66) NOT NULL,
    backrun_swap_transaction_hash FixedString(66) NOT NULL,
    profit_token_address FixedString(42) NULL,
    profit_amount Int128 NULL
) ENGINE = MergeTree()
ORDER BY (block_number, sandwiched_transaction_hash, frontrun_swap_transaction_hash, backrun_swap_transaction_hash)
PRIMARY KEY (block_number, sandwiched_transaction_hash, frontrun_swap_transaction_hash, backrun_swap_transaction_hash)

-- aggregation_indices 