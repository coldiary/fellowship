import { proxyAddress } from 'config';
import { Campaign } from 'types/Tips';

export const getAllCampaigns = async (): Promise<Campaign[]> => {
    const res = await fetch(`${proxyAddress}/tips/all`);
    const data = await res.json() as Campaign[];
    return data;
};
