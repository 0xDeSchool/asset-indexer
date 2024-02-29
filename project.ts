import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

const AssetHub = "0xd2a9694fd84e50816895eb719cae5496a249d09b"
const FeeCollectModule = "0x7fe80b0a7b538ae7023b2d72b41dc4b784bd4e9a"
const NftAssetGatedModule = "0x01a1b19db5eae3596ce09a258a73748f20bc9695"

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
    startBlock: 46487670,
    options: {
      abi: 'AssetHub',
      address: AssetHub,
    },
    assets: new Map([
      ['AssetHub', { file: './abis/AssetHub.json' }],
      ['AssetHubLogic', { file: './abis/AssetHubLogic.json' }]
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
    startBlock: 46487670,
    options: {
      abi: 'AssetHub',
      address: AssetHub,
    },
    assets: new Map([
      ['AssetHub', { file: './abis/AssetHub.json' }],
      ['IContractMetadata', { file: './abis/IContractMetadata.json' }],
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
          handler: "handleCollectedAssetHubLog",
          kind: EthereumHandlerKind.Event,
          filter: {
            topics: [
              "Collected(uint256,address,address,address,uint256,address,bytes,uint256)"
            ]
          }
        },
      ]
    }
  },
  {
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46487528,
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
    startBlock: 46487528,
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
