
import assert from "assert";
import { AssetHubDeployedLog } from "../types/abi-interfaces/AssetHubManager"
import { AssetHub } from "../types/models"
import { createAssetHubEventsDatasource } from "../types";

async function getOrCreate(hash: string) {
  let hub = await AssetHub.get(hash);
  if (!hub) {
    hub = AssetHub.create({
      id: hash
    })
  }
  return hub;
}

export async function handleAssetHubDeployedLog(log: AssetHubDeployedLog) {
  logger.info("Handling AssetHubDeployed");
  assert(log.args, "No log args");
  
  let assetHub = await getOrCreate(log.transactionHash);
  assetHub.hub = log.args.assetHub;
  assetHub.admin = log.args.admin;
  assetHub.feeCollectModule = log.args.feeCollectModule;
  assetHub.nftGatedModule = log.args.nftGatedModule;
  assetHub.feeCreateAssetModule = log.args.feeAssetCreateModule;
  assetHub.timestamp = log.block.timestamp
  await assetHub.save()

  await createAssetHubEventsDatasource({ address: assetHub.hub })
}