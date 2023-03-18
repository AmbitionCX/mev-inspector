# mev-inspector
Visualization of frount-running / back-running / sandwich mev on Ethereum blockchain


## database
We have three data source:
1. blockchain data from Ethereum node (geth + teku)
2. MEV data from [mev-inspect-py](https://github.com/flashbots/mev-inspect-py). The endpoint for mev-inspect-py is from pokt.network's "Ethereum Mainnet Archival with trace calls". To obtain mev data in kubernetes, you need to forward pod port to localhost:
```bash
kubectl port-forward pod/postgresql-0 5432:5432
```
3. open data from [Mevboost.pics](https://mevboost.pics/data.html). Those data are formed in Apache Parquet format. You can load it to clickhouse.

## frontend
The frontend is writen with Vite + Vue3 + d3.js. Run the frontend with the following commands:
```shell
cd mev-vis
pnpm install
pnpm run dev
```
