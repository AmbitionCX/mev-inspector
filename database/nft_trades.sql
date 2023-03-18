CREATE TABLE IF NOT EXISTS mev.nft_trades
(
    block_number UInt32 NOT NULL,
    transaction_hash FixedString(66) NOT NULL,
    abi_name String NOT NULL,
    protocol String NOT NULL,
    seller_address FixedString(42) NOT NULL,
    buyer_address FixedString(42) NOT NULL,
    payment_token_address FixedString(42) NOT NULL,
    payment_amount Int128 NOT NULL,
    collection_address FixedString(42) NOT NULL,
    token_id UInt32 NOT NULL
) ENGINE = MergeTree()
ORDER BY (block_number, transaction_hash)
PRIMARY KEY (block_number, transaction_hash)

-- aggregation_indices 