import { Contract } from "ethers";
import { fetchMetadata } from "./asset_metadata";
import { Asset, ContractInfo } from "../types";
import { IContractMetadata__factory, IContractMetadata } from "../types/contracts";


type ContractMetadata = {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  featuredImage?: string;
  externalLink?: string;
  collaborators?: string;
}

export async function setContract(address: string) {
  let ct = await ContractInfo.get(address);
  if (!ct) {
    ct = Asset.create({
      id: address,
    });
  }
  const metadata = await getContractMetadata(address)
  if (metadata) {
    ct = Object.assign(ct, metadata)
  }
  await ct.save();
}

export async function getContractMetadata(contract: string): Promise<ContractMetadata | undefined> {
  const ct = IContractMetadata__factory.connect(contract, api)
  try {
    const contentURI = await ct.contractURI()
    if (contentURI) {
      const metadata = await fetchMetadata(contentURI)
      return metadata as ContractInfo
    }
  } catch (e) {
    logger.warn("get contract contractURI method failed: " + e?.toString());
  }

  try {
    const name = await ct.name()
    return {
      name: name as string
    }
  } catch (e) {
    logger.warn("get contract name method failed: " + e?.toString());
  }
}