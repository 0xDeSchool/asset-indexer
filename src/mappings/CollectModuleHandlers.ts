// import { ZeroAddress } from "..";
// import { FeeConfigChangedLog } from "../types/abi-interfaces/FeeCollectModule";
// import { setContract } from "./contract_metadata";

// export async function handleFeeCollectModuleConfigChanged(log: FeeConfigChangedLog) {
//   const config = log.args?.config;
//   if (!config) {
//     return;
//   }
//   if (config.currency && config.currency != ZeroAddress) {
//     await setContract(config.currency)
//   }
// }