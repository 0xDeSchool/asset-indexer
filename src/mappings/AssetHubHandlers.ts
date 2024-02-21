// SPDX-License-Identifier: Apache-2.0

// Auto-generated

import assert from "assert";
import { Asset, SubScriber } from "../types";
import { AssetCreatedLog, AssetMetadataUpdateLog, SubscribeModuleWhitelistedLog, SubscribeNFTDeployedLog, SubscribedLog, TransferLog, } from "../types/abi-interfaces/AssetHub";
import { fetchMetadata } from "./asset_metadata";

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

export async function getOrCreateSubscriber(id: string): Promise<SubScriber> {
  let subscriber = await SubScriber.get(id);
  if (!subscriber) {
    subscriber = SubScriber.create({
      id: id
    });
  }
  return subscriber;
}

export async function handleAssetCreatedAssetHubLog(log: AssetCreatedLog): Promise<void> {
  logger.info("Handling AssetCreated");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await getOrCreateAsset(id);
  asset.contractAddress = log.address;
  asset.assetId = log.args.assetId.toBigInt();
  asset.contentURI = log.args.contentURI;
  asset.publisher = log.args.publisher;
  asset.subscribeModule = log.args.subscribeModule;
  asset.timestamp = log.args.timestamp.toBigInt();
  asset.hash = log.transactionHash;

  await parseMetadata(asset, asset.timestamp?.toString())
  await asset.save();
}

export async function handleSubscribeModuleWhitelistedAssetHubLog(log: SubscribeModuleWhitelistedLog): Promise<void> {
  // Place your code logic here
}

export async function handleSubscribeNFTDeployedAssetHubLog(log: SubscribeNFTDeployedLog): Promise<void> {
  logger.info("Handling SubscribeNFTDeployed");
  assert(log.args, "No log args");

  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await Asset.get(id);
  if (!asset) {
    logger.error("Asset not found");
    return;
  }
  asset.subscriberNFT = log.args.subscribeNFT;
  await asset.save()
}

export async function handleSubscribedAssetHubLog(log: SubscribedLog): Promise<void> {
  logger.info("Handling Subscribed");
  assert(log.args, "No log args");
  const subscriber = await getOrCreateSubscriber(log.transactionHash);

  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  subscriber.assetId = id;
  subscriber.subscriber = log.args.subscriber;
  subscriber.tokenId = log.args.subscribeNFTTokenId.toBigInt();
  subscriber.subscribeModule = log.args.subscribeModule;
  subscriber.subscribeModuleData = log.args.subscribeModuleData;
  subscriber.timestamp = log.args.timestamp.toBigInt();
  await subscriber.save();

  const asset = await getOrCreateAsset(id);
  if (asset) {
    if (!asset.subscribeCount) {
      asset.subscribeCount = BigInt(1);
    } else {
      asset.subscribeCount = asset.subscribeCount + BigInt(1);
    }
    await asset.save();
  }
}

export async function handleTransferAssetHubLog(log: TransferLog): Promise<void> {
  logger.info("Handling TransferAsset");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.tokenId.toBigInt().toString();
  const asset = await getOrCreateAsset(id);
  if (!asset) {
    logger.error("Asset not found");
    return;
  }
  asset.publisher = log.args.to;
  await asset.save();
}

export async function handleAssetMeataDataUpdateHubLog(log: AssetMetadataUpdateLog): Promise<void> {
  logger.info("Handling TransferAsset");
  assert(log.args, "No log args");
  const id = log.address + "-" + log.args.assetId.toBigInt().toString();
  const asset = await getOrCreateAsset(id);
  if (!asset) {
    logger.error("Asset not found");
    return;
  }
  asset.contentURI = log.args.contentURI;
  await parseMetadata(asset, log.args.timestamp.toString())
  await asset.save();
}

async function parseMetadata(asset: Asset, timestamp?: string) {
  if (!asset.contentURI) {
    return
  }
  const metadata = await fetchMetadata(asset.contentURI);
  if (metadata) {
    metadata.timestamp = timestamp
    asset.name = metadata.name;
    asset.type = metadata.type;
    asset.metadata = JSON.stringify(metadata);
  }
}