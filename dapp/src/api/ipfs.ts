// @ts-ignore
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js';
import { nftStorageApiKey } from 'config';

const client = new NFTStorage({ token: nftStorageApiKey });

export const uploadToIPFS = async (data: File | string) => {
    const blob: Blob = typeof data === 'string' ? new Blob([data]) : data;
    const cid = await client.storeBlob(blob);
    return cid;
};
