CREATE TABLE IF NOT EXISTS mev.mevboost_eth_data
(
    id UInt32 NOT NULL,
    date DateTime NOT NULL,
    slot UInt32 NOT NULL,
    block_number UInt32 NOT NULL,
    relay String NULL,
    builder_pubkey FixedString(98) NULL,
    proposer_pubkey FixedString(98) NULL,
    mevboost_value String NULL,
    builder String NULL,
    validator String NULL,
) ENGINE = MergeTree()
ORDER BY (id, slot)
PRIMARY KEY (id)