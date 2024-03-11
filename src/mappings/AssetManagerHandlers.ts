
import assert from "assert";
import { AssetHubDeployedLog } from "../types/abi-interfaces/AssetHubManager"
import { AssetHub } from "../types/models"
import { createAssetHubEventsDatasource } from "../types";

export async function getOrCreateHub(hubAddress: string) {
  let hub = await AssetHub.get(hubAddress);
  if (!hub) {
    hub = AssetHub.create({
      id: hubAddress
    })
  }
  return hub;
}

export async function handleAssetHubDeployedLog(log: AssetHubDeployedLog) {
  logger.info("Handling AssetHubDeployed");
  assert(log.args, "No log args");

  let assetHub = await getOrCreateHub(log.args.assetHub);
  assetHub.admin = log.args.admin;
  assetHub.feeCollectModule = log.args.feeCollectModule;
  assetHub.nftGatedModule = log.args.nftGatedModule;
  assetHub.feeCreateAssetModule = log.args.feeAssetCreateModule;
  assetHub.timestamp = log.block.timestamp
  assetHub.hash = log.transactionHash;
  await assetHub.save()

  await createAssetHubEventsDatasource({ address: assetHub.id })
}
