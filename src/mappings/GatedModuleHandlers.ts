import { ZeroAddress } from "..";
import { ConfigChangedLog } from "../types/abi-interfaces/NftAssetGatedModule";
import { setContract } from "./contract_metadata";

export async function handleNftGatedModuleConfigChanged(log: ConfigChangedLog) {
  const configs = log.args!.config
  if (!configs) {
    return
  }
  for (let i = 0; i < configs.length; i++) {
    const c = configs[i];
    if (c.nftContract && c.nftContract != ZeroAddress) {
      await setContract(c.nftContract)
    }
  }
}