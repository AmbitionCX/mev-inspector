# pip install fastparquet (pip 22.0.2)
from fastparquet import ParquetFile

pf = ParquetFile('/home/disk/downloads/openethdata_eth_data.parquet.gzip')

# print parquet file info
print(pf.info)

df = pf.to_pandas()

# export parquet file to csv
df.to_csv('/home/disk/downloads/openethdata_eth_data.csv', sep=',', encoding='utf-8')