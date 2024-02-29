// SPDX-License-Identifier: Apache-2.0

// Auto-generated

import assert from "assert";
import { Asset, AssetMetadataHistory, Collector } from "../types";
import { AssetMetadataUpdateLog, AssetUpdatedLog, CollectModuleWhitelistedLog, TransferLog, AssetCreatedLog } from "../types/abi-interfaces/AssetHub";
import { fetchMetadata } from "./asset_metadata";
import { setContract } from "./contract_metadata";
import { CollectedLog } from "../types/abi-interfaces/AssetHubLogic";

export const ZeroAddress = "0x0000000000000000000000000000000000000000"

export async function getOrCreateAsset(
  id: string,
): Promise<Asset> {
  let asset = await Asset.get(id);
  if (!asset) {
    asset = Asset.create({
      id: id,
    });
  }
  return asset;
}

function createAssetMetadataHistroy(id: string, assetId: string, metadata?: string, timestamp?: bigint) {
  const h = AssetMetadataHistory.create({
    id: id,
    assetId: assetId,
    metadata: metadata,
    timestamp: timestamp,
  });
  return h.save();
}

export async function getOrCreateCollector(id: string): Promise<Collector> {
  let collector = await Collector.get(id);
  if (!collector) {
    collector = Collector.create({
      id: id
    });
  }
  return collector;
}


export async function handleAssetCreatedAssetHubLog(log: AssetCreatedLog): Promise<void> {
  logger.info("Handling AssetCreated");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await getOrCreateAsset(id);
  asset.hub = log.address;
  asset.assetId = log.args.assetId.toBigInt();
  asset.contentUri = log.args.data.contentURI;
  asset.publisher = log.args.publisher;
  asset.collectModuleId = log.args.data.collectModule;
  asset.collectNftId = log.args.data.collectNFT;
  asset.timestamp = log.args.data.timestamp.toBigInt();
  asset.hash = log.transactionHash;

  await parseMetadata(asset, asset.timestamp?.toString())
  await asset.save();
  await createAssetMetadataHistroy(log.transactionHash, id, asset.metadata, asset.timestamp)
}

export async function handleAssetUpdateHubLog(log: AssetUpdatedLog) {
  logger.info("Handling AssetUpdated");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await Asset.get(id);
  if (!asset) {
    logger.error("Asset not found");
    return;
  }
  if (asset.collectModuleId != log.args.data.collectModule) {
    asset.collectModuleId = log.args.data.collectModule;
    if (asset.collectModuleId) {
      setContract(asset.collectModuleId)
    }
  }
  if (asset.collectNftId != log.args.data.gatedModule) {
    asset.collectNftId = log.args.data.gatedModule;
    if (asset.collectNftId) {
      setContract(asset.collectNftId)
    }
  }
  await asset.save();
}

export async function handleCollectModuleWhitelistedAssetHubLog(log: CollectModuleWhitelistedLog): Promise<void> {
  // Place your code logic here
}

// export async function handleCollectNFTDeployedAssetHubLog(log: CollectNFTDeployedLog): Promise<void> {
//   logger.info("Handling CollectNFTDeployed");
//   assert(log.args, "No log args");

//   const id = log.address + "-" + log.args.assetId.toBigInt().toString();
//   const asset = await Asset.get(id);
//   if (!asset) {
//     logger.error("Asset not found");
//     return;
//   }
//   asset.collectNftId = log.args.collectNFT;
//   await asset.save()
// }

export async function handleCollectedAssetHubLog(log: CollectedLog): Promise<void> {
  logger.info("Handling Collected");
  assert(log.args, "No log args");
  const collector = await getOrCreateCollector(log.transactionHash);

  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  collector.assetId = id;
  collector.collector = log.args.collector;
  collector.tokenId = log.args.collectNFTTokenId.toBigInt();
  collector.collectModule = log.args.collectModule;
  collector.collectModuleData = log.args.collectModuleData;
  collector.timestamp = log.args.timestamp.toBigInt();
  await collector.save();

  const asset = await Asset.get(id);
  if (asset) {
    if (!asset.collectCount) {
      asset.collectCount = BigInt(1);
    } else {
      asset.collectCount = asset.collectCount + BigInt(1);
    }
    await asset.save();
  }
}

export async function handleTransferAssetHubLog(log: TransferLog): Promise<void> {
  logger.info("Handling TransferAsset");
  assert(log.args, "No log args");
  if (log.args.from == ZeroAddress) {
    logger.warn("First create asset before transfer, skipping...")
    return;
  }
  const id = log.address + "-" + log.args.tokenId.toBigInt().toString();
  const asset = await Asset.get(id);
  if (!asset) {
    logger.warn("Asset not found: " + id);
    return;
  }
  asset.publisher = log.args.to;
  await asset.save();
}

export async function handleAssetMetadataUpdateHubLog(log: AssetMetadataUpdateLog): Promise<void> {
  logger.info("Handling AssetMetadataUpdate");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await Asset.get(id);
  if (!asset) {
    logger.error("Asset not found: " + id);
    return;
  }
  asset.contentUri = log.args.contentURI;
  await parseMetadata(asset, log.args.timestamp.toString())
  await asset.save();
  await createAssetMetadataHistroy(log.transactionHash, id, asset.metadata, asset.timestamp)
}

async function parseMetadata(asset: Asset, timestamp?: string) {
  if (!asset.contentUri) {
    return
  }
  const metadata = await fetchMetadata(asset.contentUri);
  if (metadata) {
    metadata.timestamp = timestamp
    asset.name = metadata.name;
    asset.type = metadata.type;
    asset.metadata = JSON.stringify(metadata);
    asset.tags = metadata.tags ? JSON.stringify(metadata.tags) : undefined;
  }
}