export const environment = 'devnet';

export const contracts = {
  tips: {
    name: 'Tips',
    address: 'erd1qqqqqqqqqqqqqpgqt8vfhqpvtsvjce9jle3gw5njwqq0l9hju4aq9wfw9s',
    abiPath: '/tips.abi.json',
    sourceUrl: 'https://github.com/coldiary/fellowship/tree/main/contracts/tips',
  },
  trade: {
    name: 'Trade',
    address: 'erd1qqqqqqqqqqqqqpgql585tt797dfpg0lpn6ce264nv59a8g9eu4aqx5tvq8',
    abiPath: '/trade.abi.json',
    sourceUrl: 'https://github.com/coldiary/fellowship/tree/main/contracts/trade'
  },
};

export const nftStorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0NzI4MDdFQTc4YzhGN2M4NTU0RWYyZDlDMzYxMDQwODU0OTc0RDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0Mjk5NjgwOTg1NiwibmFtZSI6ImZlbGxvd3NoaXAifQ.Ntaf_Ckf4D38SpRqWwOTJ4dXI_-Q3UYECrQNzOvi_Ck';
export const ipfsGateway = 'http://127.0.0.1:8080/ipfs';
export const apiAddress = 'https://devnet-api.elrond.com';
export const explorerAddress = 'http://devnet-explorer.elrond.com';
