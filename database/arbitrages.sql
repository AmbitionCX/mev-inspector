CREATE TABLE IF NOT EXISTS mev.arbitrages
(
    block_number UInt32 NOT NULL,
    transaction_hash FixedString(66) NOT NULL,
    protocols Array(String),
    account_address FixedString(66) NOT NULL,
    profit_token_address String NULL,
    start_amount Int128 NULL,
    end_amount Int128 NULL,
    profit_amount Int128 NULL,
) ENGINE = MergeTree()
ORDER BY (block_number, transaction_hash)
PRIMARY KEY (block_number,transaction_hash)