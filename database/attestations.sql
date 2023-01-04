CREATE TABLE IF NOT EXISTS eth.attestations
(
    inclusion_slot UInt32,
    inclusion_block_root FixedString(66),
    inclusion_index UInt32,
    slot UInt32,
    committee_index UInt32,
    aggregation_bits String,
    beacon_block_root FixedString(66),
    source_epoch UInt32,
    source_root FixedString(66),
    target_epoch UInt32,
    target_root FixedString(66),
) ENGINE = MergeTree()
ORDER BY (inclusion_slot, slot, committee_index)
PRIMARY KEY (inclusion_slot)

-- aggregation_indices 