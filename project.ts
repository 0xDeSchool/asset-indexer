import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

const AssetHub = "0x3f08fde5431962887b7456D7F760138AEdd84f3B"
const FeeCollectModule = "0xbC6d1CFE6C69AC9085419eB637913C21548cb14d"
const NftAssetGatedModule = "0xD9a4bDA289cfE6E4636fB60127f0762d4898Ecbd"

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.3",
  name: "asset-op-sepolia",
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
  dataSources: [{
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46407728,
    options: {
      abi: 'AssetHub',
      address: AssetHub,
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
              "AssetCreated(address,uint256,bytes,uint256)"
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
        }
      ]
    }
  },
  {
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46407728,
    options: {
      abi: 'AssetHub',
      address: AssetHub,
    },
    assets: new Map([
      ['AssetHub', { file: './abis/AssetHub.json' }],
    ]),
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          handler: "handleCollectModuleWhitelistedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "CollectModuleWhitelisted(address,bool,uint256)"
            ]
          }
        },
        {
          handler: "handleCollectNFTDeployedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "CollectNFTDeployed(uint256,address,uint256)"
            ]
          }
        },
        {
          handler: "handleCollectedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "Collected(address,address,uint256,address,uint256,address,bytes,uint256)"
            ]
          }
        },
      ]
    }
  },
  {
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46411246,
    options: {
      abi: 'FeeCollectModule',
      address: FeeCollectModule,
    },
    assets: new Map([
      ['FeeCollectModule', { file: './abis/FeeCollectModule.json' }],
    ]),
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          handler: "handleFeeCollectModuleConfigChanged",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "FeeConfigChanged(uint256,tuple(address,address,uint256))"
            ]
          }
        },
      ]
    }
  },
  {
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46407706,
    options: {
      abi: 'NftAssetGatedModule',
      address: NftAssetGatedModule,
    },
    assets: new Map([
      ['NftAssetGatedModule', { file: './abis/NftAssetGatedModule.json' }],
    ]),
    mapping: {
      file: './dist/index.js',
      handlers: [
        {
          handler: "handleNftGatedModuleConfigChanged",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "ConfigChanged(uint256,tuple(address,uint8,uint256,uint256,bool)[])"
            ]
          }
        },
      ]
    }
  }
  ],
  repository: "https://github.com/0xDeSchool/asset-indexer",
};

// Must set default to the project instance
export default project;
