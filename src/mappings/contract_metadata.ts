import { Contract } from "ethers";
import { fetchMetadata } from "./asset_metadata";
import { Asset, ContractInfo } from "../types";
const contractNameAbi = [
  {
    "inputs": [],
    "name": "contractURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

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
  const ct = new Contract(contract, contractNameAbi)
  try {
    const contentURI = await ct.callStatic.contractURI()
    if (contentURI) {
      const metadata = await fetchMetadata(contentURI)
      return metadata as ContractInfo
    }
  } catch (e) {
    logger.warn("get contract contractURI method failed: " + e?.toString());
  }

  try {
    const name = await ct.callStatic.name()
    return {
      name: name as string
    }
  } catch (e) {
    logger.warn("get contract name method failed: " + e?.toString());
  }
}