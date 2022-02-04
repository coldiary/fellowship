import { NetworkType } from '@elrondnetwork/dapp-core';

export const decimals = 4;
export const denomination = 18;
export const gasPerDataByte = 1500;
export const timeout = 10000; // 10 sec

export const walletConnectBridgeAddresses: string[] = [
  'https://walletconnect-bridge.maiar.com'
];
export const walletConnectBridge: string =
  walletConnectBridgeAddresses[
    Math.floor(Math.random() * walletConnectBridgeAddresses.length)
  ];

export const walletConnectDeepLink =
  'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet&link=https://maiar.com/';

export const contractAdresses = {
  tips: 'erd1qqqqqqqqqqqqqpgqremaaqc6z25j4tv8w0u4ke9qqqrw6r3du4aqkygha9',
  trade: 'erd1qqqqqqqqqqqqqpgqsa0t6waa9rlzrmny6hnn30kg7m22daddu4aqjfagyx'
};

export const contractAddress =
  'erd1qqqqqqqqqqqqqpgquvt728n40ssd8n2qns9jrlqpwq2jc4rj4cysfuj3ad';

export const dAppName = 'Dapp';

export const proxyAddress = 'http://localhost:3001';
export const nftStorageApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI0NzI4MDdFQTc4YzhGN2M4NTU0RWYyZDlDMzYxMDQwODU0OTc0RDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0Mjk5NjgwOTg1NiwibmFtZSI6ImZlbGxvd3NoaXAifQ.Ntaf_Ckf4D38SpRqWwOTJ4dXI_-Q3UYECrQNzOvi_Ck';
export const ipfsGateway = 'http://127.0.0.1:8080/ipfs';

export const network: NetworkType & {
  graphQlAddress: string;
} = {
  id: 'devnet',
  name: 'Devnet',
  egldLabel: 'xEGLD',
  walletAddress: 'https://devnet-wallet.elrond.com',
  apiAddress: 'https://devnet-api.elrond.com',
  gatewayAddress: 'https://devnet-gateway.elrond.com',
  explorerAddress: 'http://devnet-explorer.elrond.com',
  graphQlAddress: 'https://devnet-exchange-graph.elrond.com/graphql'
};
