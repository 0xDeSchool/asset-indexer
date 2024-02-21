// SPDX-License-Identifier: Apache-2.0

// Auto-generated

import assert from "assert";
import { Asset, SubScriber } from "../types";
import { AssetCreatedLog, SubscribeModuleWhitelistedLog, SubscribeNFTDeployedLog, SubscribedLog, } from "../types/abi-interfaces/AssetHub";


export async function getOrCreateAsset(
  assetID: BigInt,
): Promise<Asset> {
  let asset = await Asset.get(assetID.toString());
  if (!asset) {
    asset = Asset.create({
      id: assetID.toString(),
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
  const asset = await getOrCreateAsset(log.args.assetId.toBigInt());
  asset.contentURI = log.args.contentURI;
  asset.publisher = log.args.publisher;
  asset.subscribeModule = log.args.subscribeModule;
  asset.timestamp = log.args.timestamp.toBigInt();
  await asset.save();
}

export async function handleSubscribeModuleWhitelistedAssetHubLog(log: SubscribeModuleWhitelistedLog): Promise<void> {
  // Place your code logic here
}

export async function handleSubscribeNFTDeployedAssetHubLog(log: SubscribeNFTDeployedLog): Promise<void> {
  logger.info("Handling SubscribeNFTDeployed");
  assert(log.args, "No log args");

  const asset = await Asset.get(log.args.assetId.toBigInt().toString());
  if (!asset) {
    logger.error("Asset not found");
    return;
  }
  asset.SubScriberNFT = log.args.subscribeNFT;
  await asset.save()
}

export async function handleSubscribedAssetHubLog(log: SubscribedLog): Promise<void> {
  logger.info("Handling Subscribed");
  assert(log.args, "No log args");
  const subscriber = await getOrCreateSubscriber(log.transactionHash);
  subscriber.assetId = log.args.assetId.toBigInt();
  subscriber.publisher = log.args.publisher;
  subscriber.subscriber = log.args.subscriber;
  subscriber.subscribeModule = log.args.subscribeModule;
  subscriber.timestamp = log.args.timestamp.toBigInt();
  await subscriber.save();
}
