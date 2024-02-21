import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "polygon-mumbai-starter",
  description:
    "This project can be use as a starting point for developing your new polygon Mumbai SubQuery project",
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
    endpoint: ["https://polygon-mumbai.infura.io/v3/d8e813dfdc3c4d7690fa306835ed47b0"],
  },
  dataSources: [{
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 46128314,
    options: {
      abi: 'AssetHub',
      address: '0xE4BE76f210b61b7AE2DCce3F2116d477464bA7a5',
    },
    assets: new Map([['AssetHub', {file: './abis/AssetHub.json'}]]),
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
