import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.2",
  name: "asset-polygon-mumbai",
  description: "Asset Indexer for Polygon Mumbai Testnet",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for Polygon this is 80001
     * https://chainlist.org/chain/80001
     */
    chainId: "80001",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://rpc-mumbai.polygon.technology"],
  },
  dataSources: [{
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46171503,
    endBlock: 46171536,
    options: {
      abi: 'AssetHub',
      address: '0xDD97348935bF46a947C41ef2E9389eFC26EeD363',
    },
    assets: new Map([['AssetHub', { file: './abis/AssetHub.json' }]]),
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          handler: "handleAssetCreatedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "AssetCreated(address,uint256,string,address,bytes,uint256)"
            ]
          }
        },
        {
          handler: "handleTransferAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "Transfer(address,address,uint256)"
            ]
          }
        },
        {
          handler: "handleSubscribeModuleWhitelistedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "SubscribeModuleWhitelisted(address,bool,uint256)"
            ]
          }
        },
        {
          handler: "handleSubscribeNFTDeployedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "SubscribeNFTDeployed(uint256,address,uint256)"
            ]
          }
        },
        {
          handler: "handleSubscribedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "Subscribed(address,address,uint256,bytes,uint256)"
            ]
          }
        }
      ]
    }
  },],
  repository: "https://github.com/0xDeSchool/asset-indexer",
};

// Must set default to the project instance
export default project;
