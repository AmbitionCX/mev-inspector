# mev-inspector
Visualization of frount-running / back-running / sandwich mev on Ethereum blockchain


# Structure
## database
Store data from a full geth node to clickhouse database
```shell
cd database & pnpm install
```
To obtain mev data in kubernetes, you need to forward pod port to localhost
```bash
kubectl port-forward pod/postgresql-0 5432:5432
```

## frontend
Vite
```shell
cd mev-vis
pnpm install
pnpm run dev
```
