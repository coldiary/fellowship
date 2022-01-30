import { NFTStorage } from 'nft.storage';
// @ts-ignore
import { NFTStorage as NFTStorageClient } from 'nft.storage/dist/bundle.esm.min.js';
import { ipfsGateway, nftStorageApiKey } from 'config';

const client: NFTStorage = new NFTStorageClient({ token: nftStorageApiKey });

export const uploadToIPFS = async (data: File | string) => {
    const blob: Blob = typeof data === 'string' ? new Blob([data]) : data;
    const cid = await client.storeBlob(blob);
    return cid;
};

export const getIPFSUri = (cidOrUrl: string) => {
    const cid = cidOrUrl.startsWith('http') || cidOrUrl.startsWith('ipfs') ? cidOrUrl.split('/').pop() : cidOrUrl;
    return `${ipfsGateway}/${cid}`;
};

export const fetchObjectFromIPFS = async <T = any>(cidOrUrl: string): Promise<T> => {
    const res = await fetch(getIPFSUri(cidOrUrl));
    const data = await res.json() as T;
    return data;
};
