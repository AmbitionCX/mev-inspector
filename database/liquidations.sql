CREATE TABLE IF NOT EXISTS mev.liquidations
(
    block_number UInt32 NOT NULL,
    transaction_hash FixedString(66) NOT NULL,
    protocol String NULL,
    liquidated_user FixedString(42) NOT NULL,
    liquidator_user FixedString(42) NOT NULL,
    debt_token_address FixedString(42) NOT NULL,
    debt_purchase_amount Int128 NOT NULL,
    received_amount Int128 NOT NULL,
    received_token_address FixedString(42) NULL,
) ENGINE = MergeTree()
ORDER BY (block_number, transaction_hash)
PRIMARY KEY (block_number, transaction_hash)