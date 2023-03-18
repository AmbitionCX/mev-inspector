#!/bin/bash

# Add "id" to the csv name since clickhouse does not support auto increment 
file="/home/disk/downloads/openethdata_eth_data.csv"

# load parquet csv to clickhouse
cat $file | clickhouse-client --host $clickhouse_host --password $clickhouse_password --query='INSERT INTO mev.mevboost_eth_data FORMAT CSVWithNames'