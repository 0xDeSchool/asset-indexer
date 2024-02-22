import fetch from "node-fetch"

export type AssetMetaData = {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  content?: string;
  tags?: string[];
  extra?: any;
  timestamp?: string;
}

const ipfsEndpoint = "https://ipfs.io/ipfs/";

export async function fetchMetadata(uri: string): Promise<AssetMetaData | undefined> {
  if (!uri) {
    return;
  }
  try {
    const data = await fetch(parseUri(uri)).then(r => r.json());
    logger.info(data)
    return data;
  } catch (e) {
    logger.warn("fetch metadata error: ");
    logger.warn(e);
  }
}

function parseUri(uri: string): string {
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }
  if (uri.startsWith("ipfs://")) {
    return ipfsEndpoint + uri.slice(7);
  }
  if (uri.startsWith("ar://")) {
    return "https://arweave.net/" + uri.slice(5);
  }
  return ""
}