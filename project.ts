import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

const AssetHubManager = "0x3c6bE7A6A82cFc25AcE1DB08c143F5F094efEFE6"

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.3",
  name: "assethub",
  description: "Asset Indexer",
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
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 46908386,
      options: {
        abi: "AssetManager",
        address: AssetHubManager
      },
      assets: new Map([
        ['AssetManager', { file: './abis/AssetHubManager.json' }],
      ]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            handler: "handleAssetHubDeployedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "AssetHubDeployed(address,name,address,address,address,address)"
              ]
            }
          },
        ]
      }
    },
  ],
  templates: [
    {
      name: "AssetHubEvents",
      kind: EthereumDatasourceKind.Runtime,
      options: {
        abi: 'IAssetHubEvents',
      },
      assets: new Map([
        ['IAssetHubEvents', { file: './abis/IAssetHubEvents.json' }],
        ['AssetHub', { file: './abis/AssetHub.json' }]
      ]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            handler: "handleAssetCreatedAssetHubLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "AssetCreated(address,uint256,string,address,address,address,uint256)"
              ]
            }
          },
          {
            handler: "handleCollectedAssetHubLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "Collected(uint256,address,address,address,uint256,address,bytes,uint256)"
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
            handler: "handleAssetMetadataUpdateHubLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "AssetMetadataUpdate(uint256,string,uint256)"
              ]
            }
          },
          {
            handler: "handleAssetHubUpgradedLog",
            kind: EthereumHandlerKind.Event,
            filter: {
              topics: [
                "Upgraded(address)"
              ]
            }
          }
        ]
      }
    },
  ],
  repository: "https://github.com/0xDeSchool/asset-indexer",
};

// Must set default to the project instance
export default project;
