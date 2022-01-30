import { proxyAddress } from 'config';
import { Campaign } from 'types/Tips';

export const getCampaign = async (id: number) => {
    const res = await fetch(`${proxyAddress}/tips/campaign/${id}`);
    const data = await res.json() as Campaign;
    return data;
};
